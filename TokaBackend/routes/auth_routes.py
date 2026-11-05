from datetime import datetime

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
import bcrypt

from models.auth_models import (
    Chat,
    ChatMessage,
    CreateChatRequest,
    LoginForm,
    RegisterForm,
    SendMessageRequest,
    AuthResponse,
)
from database import users, chats
from pymongo.errors import DuplicateKeyError
 
auth_router = APIRouter()


class ChatConnectionManager:
    def __init__(self):
        self.connections = {}

    async def connect(self, chat_name: str, websocket: WebSocket):
        await websocket.accept()
        self.connections.setdefault(chat_name, []).append(websocket)

    def disconnect(self, chat_name: str, websocket: WebSocket):
        chat_connections = self.connections.get(chat_name, [])
        if websocket in chat_connections:
            chat_connections.remove(websocket)
        if not chat_connections:
            self.connections.pop(chat_name, None)

    async def broadcast(self, chat_name: str, message: dict):
        for websocket in list(self.connections.get(chat_name, [])):
            try:
                await websocket.send_json(message)
            except (WebSocketDisconnect, RuntimeError):
                self.disconnect(chat_name, websocket)


chat_manager = ChatConnectionManager()
 
@auth_router.post("/register", response_model=AuthResponse)
def register_user(form: RegisterForm):
 
    # Check if the user exists
    found_user = users.find_one({"email": form.email})
 
    if found_user:
        raise HTTPException(
            status_code=403,
            detail="User with this email already exists"
        )
 
    try:
        password_hash = bcrypt.hashpw(
            form.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        users.insert_one({
            "email": form.email,
            "password": password_hash,
            "name": form.name,
            "initials": form.initials,
        })
    except DuplicateKeyError:
        raise HTTPException(
            status_code=403,
            detail="User with this email already exists"
        )
 
    # Hash the password
 
    # Add user to our database
 
    # Return user response to log them in automatically
 
    return AuthResponse(
        email=form.email,
        name=form.name,
        initials=form.initials,
    )
 
@auth_router.post("/login", response_model=AuthResponse)
def login_user(form: LoginForm):
 
    # Check if the user exists
    found_user = users.find_one({"email": form.email})
    stored_password = found_user.get("password") if found_user else None
    valid_password = False
    if isinstance(stored_password, str) and stored_password.startswith("$2"):
        try:
            valid_password = bcrypt.checkpw(
                form.password.encode("utf-8"),
                stored_password.encode("utf-8")
            )
        except ValueError:
            valid_password = False
 
    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )
 
    # Return user response to log them in automatically
 
    return AuthResponse(
        email=form.email,
        name=found_user["name"],
        initials=found_user.get("initials", ""),
    )

@auth_router.get("/users", response_model=list[AuthResponse])
def get_other_users(user_email: str):
    user_documents = users.find(
        {"email": {"$ne": user_email}},
        {
            "_id": 0,
            "password": 0
        }
    )

    return [
        AuthResponse(
            email=user["email"],
            name=user.get("name", user["email"]),
            initials=user.get("initials", "")
        )
        for user in user_documents
    ]

@auth_router.post("/chat", response_model=Chat)
def create_chat(form: CreateChatRequest):
    member_emails = list(dict.fromkeys([form.user_email, *form.member_emails]))
    member_documents = list(users.find(
        {"email": {"$in": member_emails}},
        {"_id": 0, "password": 0}
    ))

    members_by_email = {
        member["email"]: member
        for member in member_documents
    }
    if len(members_by_email) != len(member_emails):
        raise HTTPException(
            status_code=404,
            detail="One or more selected users could not be found"
        )

    existing_chat = next(
        (
            chat for chat in chats.find({"members": {"$all": member_emails}})
            if set(chat.get("members", [])) == set(member_emails)
        ),
        None
    )
    if existing_chat is not None:
        chat_document = existing_chat
    else:
        selected_members = [members_by_email[email] for email in member_emails]
        other_members = [
            member for member in selected_members
            if member["email"] != form.user_email
        ]
        is_direct_message = len(member_emails) == 2
        chat_document = {
            "name": other_members[0]["name"] if is_direct_message else ", ".join(
                member["name"] for member in other_members
            ),
            "initials": other_members[0].get("initials", "") if is_direct_message else "GP",
            "chat_type": "dm" if is_direct_message else "group",
            "members": member_emails,
            "messages": []
        }
        chats.insert_one(chat_document)

    chat_document["members"] = [
        {
            "email": email,
            "name": members_by_email[email].get("name", email),
            "initials": members_by_email[email].get("initials", "")
        }
        for email in member_emails
    ]
    chat_document.pop("_id", None)
    return chat_document
 
@auth_router.get("/chat", response_model=list[Chat])
def get_user_chats(user_email: str):
    chat_documents = list(
        chats.find(
            {"members": user_email},
            {"_id": 0}
        )
    )

    for chat in chat_documents:
        member_emails = chat["members"]

        member_documents = users.find(
            {"email": {"$in": member_emails}},
            {
                "_id": 0,
                "password": 0
            }
        )

        members_by_email = {
            member["email"]: member
            for member in member_documents
        }

        chat["members"] = [
            {
                "email": email,
                "name": members_by_email[email].get("name", email),
                "initials": members_by_email[email].get("initials", "")
            }
            for email in member_emails
            if email in members_by_email
        ]

    return chat_documents

@auth_router.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket, chat_name: str, user_email: str):
    sender = users.find_one({"email": user_email})
    chat = chats.find_one({
        "name": chat_name,
        "members": user_email
    })

    if sender is None or chat is None:
        await websocket.close(code=1008)
        return

    await chat_manager.connect(chat_name, websocket)

    try:
        while True:
            payload = await websocket.receive_json()
            message_text = str(payload.get("message", "")).strip()
            if not message_text:
                continue

            new_message = ChatMessage(
                user=user_email,
                initials=sender.get("initials", ""),
                message=message_text,
                time=datetime.now().strftime("%I:%M %p")
            )

            chats.update_one(
                {"_id": chat["_id"]},
                {"$push": {"messages": new_message.model_dump()}}
            )
            await chat_manager.broadcast(chat_name, new_message.model_dump())
    except WebSocketDisconnect:
        chat_manager.disconnect(chat_name, websocket)

@auth_router.post("/chat/message", response_model=ChatMessage)
def send_chat_message(form: SendMessageRequest):
    message_text = form.message.strip()
    if not message_text:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    sender = users.find_one(
        {"email": form.user_email},
        {"_id": 0, "password": 0}
    )
    if sender is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    chat = chats.find_one({
        "name": form.chat_name,
        "members": form.user_email
    })
    if chat is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    new_message = ChatMessage(
        user=form.user_email,
        initials=sender.get("initials", ""),
        message=message_text,
        time=datetime.now().strftime("%I:%M %p")
    )

    chats.update_one(
        {"_id": chat["_id"]},
        {"$push": {"messages": new_message.model_dump()}}
    )

    return new_message
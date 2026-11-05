from typing import Literal
from datetime import datetime
from pydantic import BaseModel

class RegisterForm(BaseModel):
    name: str
    initials: str
    email: str
    password: str

class LoginForm(BaseModel):
    email: str
    password: str

class SendMessageRequest(BaseModel):
    chat_name: str
    user_email: str
    message: str

class CreateChatRequest(BaseModel):
    user_email: str
    member_emails: list[str]

class AuthResponse(BaseModel):
    name: str
    email: str
    initials: str

class ChatMessage(BaseModel):
    user: str
    initials: str
    message: str
    time: str

class ChatMember(BaseModel):
    email: str
    name: str
    initials: str


class Chat(BaseModel):
    name: str
    initials: str
    chat_type: Literal["group", "dm"]
    members: list[ChatMember]
    messages: list[ChatMessage]
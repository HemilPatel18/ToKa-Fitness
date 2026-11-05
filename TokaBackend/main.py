from fastapi import FastAPI
from routes.auth_routes import auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    
    tags=["Auth"],
)

@app.get("/")
def read_root():
    return {"Hello": "andrii"}
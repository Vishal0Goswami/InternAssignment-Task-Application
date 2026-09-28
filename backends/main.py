from fastapi import FastAPI 
from src.utils.db import Base, engine
from src.users.routes import user_app 
from src.tasks.routes import task_app
from src.GoogleOAuth.routes import app_auth
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from src.utils.settings import settings

app = FastAPI() 

#-----------------------Secure Purpase-----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
   SessionMiddleware,
   secret_key="this-is-secret-key-one.",
    same_site="lax",
    https_only=True
)

Base.metadata.create_all(engine)




app.include_router(user_app)
app.include_router(task_app)
app.include_router(app_auth)

@app.get("/home")
def home():
    return {"message":"Hello, I'm writing something"}


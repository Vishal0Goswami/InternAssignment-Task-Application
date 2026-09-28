from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie 
from sqlalchemy.orm import Session
from src.users.models import User
from src.users.Pydantic import registerValidate, loginValidate, UserResponse
from src.utils.db import get_db
import jwt 
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta
from src.utils.settings import settings

from pwdlib import PasswordHash


#--------------------------------Password Hash------------------------------------------
password_hash = PasswordHash.recommended()

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)
#-----------------------------------End--------------------------------------------------

user_app = APIRouter(prefix="/user")


@user_app.post("/register", response_model=UserResponse)
def registration(body:registerValidate, db:Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, detail="Email already exists")

    new_user = User(
        name = body.name,
        email = body.email,
        password = get_password_hash(body.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user 


@user_app.post("/login")
def login(body:loginValidate, response:Response, db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    exp_time = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode({"_id":user.id, "exp":exp_time.timestamp()}, settings.SECRET_KEY, settings.ALGORITHM)

    response.set_cookie(
       key="access_token",
       value=token,
       httponly=True,
       secure=True,  # Set True in production with HTTPS
       samesite="none",
       max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES*60,
       path="/"
    )
    print("response:",response)
    return "Login Successfuly"



@user_app.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
    )
    return {"message": "Logged out successfully"}

#-----------------------------------------------Authentication---------------------------------
def Auth(access_token: str | None = Cookie(default=None), db:Session = Depends(get_db)):
    print(access_token)
    if not access_token:
        raise HTTPException(status_code=401, detail="You are unauthorized.")
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id = payload.get("_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = db.query(User).filter(User.id == user_id).first()

        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
       raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="You are unauthorized.")


#------------------------Fetch All Users------------------------------------------------
@user_app.get("/all-users", response_model=list[UserResponse])
def get_users(db:Session = Depends(get_db), user:User = Depends(Auth)):
    users = db.query(User).all();
    return users



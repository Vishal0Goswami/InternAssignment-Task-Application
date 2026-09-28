from fastapi import APIRouter, Request, Depends, Response
from sqlalchemy.orm import Session 
from src.GoogleOAuth.oauth import oauth
from fastapi.responses import HTMLResponse, RedirectResponse
from src.users.models import User 
from src.utils.db import get_db
import jwt 
from datetime import datetime, timedelta
from src.utils.settings import settings


app_auth = APIRouter()

@app_auth.get("/google/login")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URL)


@app_auth.get("/auth/google/callback", name="google_callback")
async def google_callback(request:Request, db:Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
  
    return login_with_google(token['userinfo'], db)


def login_with_google(data:dict, db:Session):
    user = db.query(User).filter(User.email == data['email']).first()
    if not user:
        user = User(
            name = data['name'],
            email = data['email'],
            google_id = data['sub'],
            is_oauth = True 
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    exp_time = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode({"_id":user.id, "exp":exp_time.timestamp()}, settings.SECRET_KEY, settings.ALGORITHM)

    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/home", status_code=302)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return response
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from src.utils.settings import settings

conf = ConnectionConfig(
    MAIL_USERNAME = settings.OWN_EMAIL,
    MAIL_PASSWORD = settings.EMAIL_PASSWORD,
    MAIL_FROM = settings.OWN_EMAIL,
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="Testing Purpase",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)


async def sendEmailToUser(email:str, html:str, subject:str):

    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    print("Successfuly Send Email")
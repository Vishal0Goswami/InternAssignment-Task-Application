from pydantic_settings import SettingsConfigDict, BaseSettings

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL : str 
    SECRET_KEY : str
    ALGORITHM : str 
    ACCESS_TOKEN_EXPIRE_MINUTES : int 
    EMAIL_PASSWORD : str
    OWN_EMAIL : str
    GOOGLE_CLIENT_ID:str 
    GOOGLE_CLIENT_SECRET:str
    GOOGLE_REDIRECT_URL:str
    GOOGLE_REDIRECT_URI: str
    FRONTEND_URL: str
    COOKIE_SECURE: bool = True


settings = Settings() 

from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base
from src.utils.settings import settings


DATABASE_URL = settings.DATABASE_URL;

engine = create_engine(url=DATABASE_URL,)

LocalSession = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
    )

Base = declarative_base()

def get_db():
    session = LocalSession()
    try:
        yield session
    finally:
        session.close() 
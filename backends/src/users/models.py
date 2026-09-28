from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship
from src.utils.db import Base 


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    # OAuth Specific Fields
    google_id = Column(String, unique=True, index=True, nullable=True) 
    is_oauth = Column(Boolean, default=False)
    
    password = Column(String, nullable=True)
    task_rel = relationship("Task", back_populates="user_rel")



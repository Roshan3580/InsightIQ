from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(String(50), default="user")  # user, admin, analyst
    
    # Relationships
    datasets = relationship("Dataset", back_populates="owner")
    queries = relationship("Query", back_populates="user")
    dashboards = relationship("Dashboard", back_populates="owner") 
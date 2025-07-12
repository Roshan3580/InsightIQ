from sqlalchemy import Column, String, Text, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Dataset(Base, TimestampMixin):
    __tablename__ = "datasets"
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    row_count = Column(Integer)
    column_count = Column(Integer)
    schema = Column(JSON)  # Store column names, types, etc.
    sample_data = Column(JSON)  # Store first few rows for preview
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="datasets")
    queries = relationship("Query", back_populates="dataset") 
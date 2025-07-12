from sqlalchemy import Column, String, Text, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Query(Base, TimestampMixin):
    __tablename__ = "queries"
    
    natural_language_query = Column(Text, nullable=False)
    generated_sql = Column(Text)
    query_type = Column(String(100))  # churn_analysis, revenue_analysis, etc.
    result_data = Column(JSON)
    visualization_type = Column(String(50))  # line, bar, pie, table
    execution_time = Column(Integer)  # milliseconds
    status = Column(String(50), default="completed")  # pending, completed, failed
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="queries")
    dataset = relationship("Dataset", back_populates="queries") 
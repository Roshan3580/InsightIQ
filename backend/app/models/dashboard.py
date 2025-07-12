from sqlalchemy import Column, String, Text, Integer, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Dashboard(Base, TimestampMixin):
    __tablename__ = "dashboards"
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    layout_config = Column(JSON)  # Store dashboard layout
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="dashboards")
    widgets = relationship("DashboardWidget", back_populates="dashboard", cascade="all, delete-orphan")

class DashboardWidget(Base, TimestampMixin):
    __tablename__ = "dashboard_widgets"
    
    title = Column(String(255), nullable=False)
    widget_type = Column(String(50), nullable=False)  # chart, metric, table
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)
    width = Column(Integer, default=6)
    height = Column(Integer, default=4)
    config = Column(JSON)  # Widget-specific configuration
    query_id = Column(Integer, ForeignKey("queries.id"))
    
    # Foreign keys
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"), nullable=False)
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="widgets") 
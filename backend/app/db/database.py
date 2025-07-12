from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData
from app.core.config import settings
from app.models import Base

# Create async engine
engine = create_async_engine(
    settings.database_url_async,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_recycle=300
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Metadata for migrations
metadata = MetaData()

async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    """Create all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def drop_tables():
    """Drop all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all) 
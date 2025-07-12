#!/usr/bin/env python3
"""
Startup script for InsightIQ backend
"""
import asyncio
import os
import sys
from pathlib import Path

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent))

from app.db.database import create_tables
from app.main import app
import uvicorn

async def init_database():
    """Initialize database tables"""
    print("🔄 Initializing database...")
    try:
        await create_tables()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        print("💡 Make sure PostgreSQL is running and configured correctly")
        return False
    return True

def check_environment():
    """Check if required environment variables are set"""
    print("🔍 Checking environment configuration...")
    
    required_vars = [
        "GROQ_API_KEY",
        "DATABASE_URL",
        "DATABASE_URL_ASYNC"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("💡 Please copy env.example to .env and fill in the required values")
        return False
    
    print("✅ Environment configuration looks good")
    return True

async def main():
    """Main startup function"""
    print("🚀 Starting InsightIQ Backend...")
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Initialize database
    if not await init_database():
        sys.exit(1)
    
    print("🎉 Backend is ready to start!")
    print("📖 API documentation will be available at: http://localhost:8000/docs")
    print("🔗 API base URL: http://localhost:8000")
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    asyncio.run(main()) 
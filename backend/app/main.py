from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.api.routes import query, upload, dashboard
from app.core.config import settings

app = FastAPI(
    title="InsightIQ API",
    description="AI-Powered Business Analytics Dashboard API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query.router, prefix="/api/v1", tags=["queries"])
app.include_router(upload.router, prefix="/api/v1", tags=["upload"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["dashboard"])

@app.get("/")
async def root():
    return {"message": "Welcome to InsightIQ API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "InsightIQ API"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)}
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 
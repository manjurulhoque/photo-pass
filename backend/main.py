from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import photo_editing
from app.core.config import settings

app = FastAPI(
    title="Photo Pass API",
    description="Professional photo editing API with advanced image processing capabilities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(photo_editing.router, prefix="/api/v1", tags=["photo-editing"])

@app.get("/")
async def root():
    return {"message": "Welcome to Photo Pass API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "photo-pass-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

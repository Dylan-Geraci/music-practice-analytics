from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import songs, sessions

app = FastAPI(
    title="Music Practice Analytics API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(songs.router, prefix="/api/v1/songs", tags=["songs"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["sessions"])


@app.get("/health")
def health_check():
    return {"status": "ok"}

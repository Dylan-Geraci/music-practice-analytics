from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


class SessionCreate(BaseModel):
    song_id: UUID | None = None
    section_id: UUID | None = None
    practiced_at: datetime | None = None  # Defaults to now if not provided
    duration_minutes: int = Field(..., gt=0, le=1440)
    tempo_bpm: int | None = Field(None, gt=0, le=400)
    accuracy_rating: int | None = Field(None, ge=1, le=5)
    difficulty_rating: int | None = Field(None, ge=1, le=5)
    notes: str | None = None


class SessionUpdate(BaseModel):
    song_id: UUID | None = None
    section_id: UUID | None = None
    practiced_at: datetime | None = None
    duration_minutes: int | None = Field(None, gt=0, le=1440)
    tempo_bpm: int | None = Field(None, gt=0, le=400)
    accuracy_rating: int | None = Field(None, ge=1, le=5)
    difficulty_rating: int | None = Field(None, ge=1, le=5)
    notes: str | None = None


class SessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    song_id: UUID | None
    section_id: UUID | None
    practiced_at: datetime
    duration_minutes: int
    tempo_bpm: int | None
    accuracy_rating: int | None
    difficulty_rating: int | None
    notes: str | None
    created_at: datetime


class SessionWithDetails(SessionResponse):
    """Session with song and section details included."""
    song: dict | None = None
    section: dict | None = None

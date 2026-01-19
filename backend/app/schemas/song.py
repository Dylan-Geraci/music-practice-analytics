from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID


# Section schemas
class SectionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    order_index: int = 0
    target_tempo: int | None = Field(None, gt=0, le=400)
    notes: str | None = None


class SectionUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    order_index: int | None = None
    target_tempo: int | None = Field(None, gt=0, le=400)
    notes: str | None = None


class SectionResponse(BaseModel):
    id: UUID
    song_id: UUID
    name: str
    order_index: int
    target_tempo: int | None
    notes: str | None
    created_at: datetime


# Song schemas
class SongCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    artist: str | None = Field(None, max_length=200)
    target_tempo: int | None = Field(None, gt=0, le=400)
    sections: list[SectionCreate] | None = None


class SongUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    artist: str | None = Field(None, max_length=200)
    target_tempo: int | None = Field(None, gt=0, le=400)


class SongResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    artist: str | None
    target_tempo: int | None
    created_at: datetime
    updated_at: datetime


class SongWithSections(SongResponse):
    sections: list[SectionResponse] = []

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from app.auth import get_current_user
from app.schemas.song import (
    SongCreate, SongUpdate, SongWithSections, SongResponse,
    SectionCreate, SectionUpdate, SectionResponse,
)
from app.services import song_service

router = APIRouter()


@router.get("", response_model=list[SongWithSections])
def list_songs(user_id: str = Depends(get_current_user)):
    """Get all songs for the current user."""
    return song_service.get_songs(user_id)


@router.post("", response_model=SongWithSections, status_code=201)
def create_song(song: SongCreate, user_id: str = Depends(get_current_user)):
    """Create a new song with optional sections."""
    return song_service.create_song(user_id, song)


@router.get("/{song_id}", response_model=SongWithSections)
def get_song(song_id: UUID, user_id: str = Depends(get_current_user)):
    """Get a single song with its sections."""
    song = song_service.get_song(user_id, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.put("/{song_id}", response_model=SongWithSections)
def update_song(song_id: UUID, song: SongUpdate, user_id: str = Depends(get_current_user)):
    """Update a song."""
    updated = song_service.update_song(user_id, song_id, song)
    if not updated:
        raise HTTPException(status_code=404, detail="Song not found")
    return updated


@router.delete("/{song_id}", status_code=204)
def delete_song(song_id: UUID, user_id: str = Depends(get_current_user)):
    """Delete a song and all its sections."""
    deleted = song_service.delete_song(user_id, song_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Song not found")


# Section endpoints
@router.post("/{song_id}/sections", response_model=SectionResponse, status_code=201)
def create_section(song_id: UUID, section: SectionCreate, user_id: str = Depends(get_current_user)):
    """Add a section to a song."""
    created = song_service.create_section(user_id, song_id, section)
    if not created:
        raise HTTPException(status_code=404, detail="Song not found")
    return created


@router.put("/{song_id}/sections/{section_id}", response_model=SectionResponse)
def update_section(
    song_id: UUID,
    section_id: UUID,
    section: SectionUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update a section."""
    updated = song_service.update_section(user_id, song_id, section_id, section)
    if not updated:
        raise HTTPException(status_code=404, detail="Song or section not found")
    return updated


@router.delete("/{song_id}/sections/{section_id}", status_code=204)
def delete_section(song_id: UUID, section_id: UUID, user_id: str = Depends(get_current_user)):
    """Delete a section."""
    deleted = song_service.delete_section(user_id, song_id, section_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Song or section not found")

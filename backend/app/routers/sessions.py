from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from datetime import date
from app.auth import get_current_user
from app.schemas.session import SessionCreate, SessionUpdate, SessionWithDetails
from app.services import session_service

router = APIRouter()


@router.get("", response_model=list[SessionWithDetails])
def list_sessions(
    song_id: UUID | None = None,
    section_id: UUID | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user_id: str = Depends(get_current_user),
):
    """Get practice sessions with optional filters."""
    return session_service.get_sessions(
        user_id,
        song_id=song_id,
        section_id=section_id,
        from_date=from_date,
        to_date=to_date,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=SessionWithDetails, status_code=201)
def create_session(session: SessionCreate, user_id: str = Depends(get_current_user)):
    """Log a new practice session."""
    return session_service.create_session(user_id, session)


@router.get("/{session_id}", response_model=SessionWithDetails)
def get_session(session_id: UUID, user_id: str = Depends(get_current_user)):
    """Get a single session."""
    session = session_service.get_session(user_id, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.put("/{session_id}", response_model=SessionWithDetails)
def update_session(session_id: UUID, session: SessionUpdate, user_id: str = Depends(get_current_user)):
    """Update a session."""
    updated = session_service.update_session(user_id, session_id, session)
    if not updated:
        raise HTTPException(status_code=404, detail="Session not found")
    return updated


@router.delete("/{session_id}", status_code=204)
def delete_session(session_id: UUID, user_id: str = Depends(get_current_user)):
    """Delete a session."""
    deleted = session_service.delete_session(user_id, session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")

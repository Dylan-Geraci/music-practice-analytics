from uuid import UUID
from datetime import datetime, date
from app.db.supabase import get_supabase_client
from app.schemas.session import SessionCreate, SessionUpdate


def get_sessions(
    user_id: str,
    song_id: UUID | None = None,
    section_id: UUID | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict]:
    """Get sessions with optional filters."""
    client = get_supabase_client()

    query = client.table("practice_sessions").select(
        "*, songs(id, title, artist), song_sections(id, name)"
    ).eq("user_id", user_id)

    if song_id:
        query = query.eq("song_id", str(song_id))
    if section_id:
        query = query.eq("section_id", str(section_id))
    if from_date:
        query = query.gte("practiced_at", from_date.isoformat())
    if to_date:
        query = query.lte("practiced_at", to_date.isoformat() + "T23:59:59")

    response = query.order("practiced_at", desc=True).range(offset, offset + limit - 1).execute()

    # Rename for cleaner API
    sessions = []
    for session in response.data:
        session["song"] = session.pop("songs", None)
        session["section"] = session.pop("song_sections", None)
        sessions.append(session)

    return sessions


def get_session(user_id: str, session_id: UUID) -> dict | None:
    """Get a single session."""
    client = get_supabase_client()

    response = client.table("practice_sessions").select(
        "*, songs(id, title, artist), song_sections(id, name)"
    ).eq("user_id", user_id).eq("id", str(session_id)).single().execute()

    if response.data:
        response.data["song"] = response.data.pop("songs", None)
        response.data["section"] = response.data.pop("song_sections", None)

    return response.data


def create_session(user_id: str, session_data: SessionCreate) -> dict:
    """Create a practice session."""
    client = get_supabase_client()

    session_dict = {
        "user_id": user_id,
        "song_id": str(session_data.song_id) if session_data.song_id else None,
        "section_id": str(session_data.section_id) if session_data.section_id else None,
        "practiced_at": session_data.practiced_at.isoformat() if session_data.practiced_at else datetime.now().isoformat(),
        "duration_minutes": session_data.duration_minutes,
        "tempo_bpm": session_data.tempo_bpm,
        "accuracy_rating": session_data.accuracy_rating,
        "difficulty_rating": session_data.difficulty_rating,
        "notes": session_data.notes,
    }

    response = client.table("practice_sessions").insert(session_dict).execute()
    session = response.data[0]

    # Fetch with relations
    return get_session(user_id, session["id"])


def update_session(user_id: str, session_id: UUID, session_data: SessionUpdate) -> dict | None:
    """Update a session."""
    client = get_supabase_client()

    update_dict = {}
    for key, value in session_data.model_dump(exclude_unset=True).items():
        if key in ["song_id", "section_id"] and value is not None:
            update_dict[key] = str(value)
        elif key == "practiced_at" and value is not None:
            update_dict[key] = value.isoformat()
        else:
            update_dict[key] = value

    if not update_dict:
        return get_session(user_id, session_id)

    response = client.table("practice_sessions").update(update_dict).eq(
        "user_id", user_id
    ).eq("id", str(session_id)).execute()

    if response.data:
        return get_session(user_id, session_id)
    return None


def delete_session(user_id: str, session_id: UUID) -> bool:
    """Delete a session."""
    client = get_supabase_client()

    response = client.table("practice_sessions").delete().eq(
        "user_id", user_id
    ).eq("id", str(session_id)).execute()

    return len(response.data) > 0

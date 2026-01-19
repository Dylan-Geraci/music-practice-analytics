from uuid import UUID
from app.db.supabase import get_supabase_client
from app.schemas.song import SongCreate, SongUpdate, SectionCreate, SectionUpdate


def get_songs(user_id: str) -> list[dict]:
    """Get all songs for a user with their sections."""
    client = get_supabase_client()

    response = client.table("songs").select(
        "*, song_sections(*)"
    ).eq("user_id", user_id).order("created_at", desc=True).execute()

    # Rename song_sections to sections for cleaner API
    songs = []
    for song in response.data:
        song["sections"] = song.pop("song_sections", [])
        songs.append(song)

    return songs


def get_song(user_id: str, song_id: UUID) -> dict | None:
    """Get a single song with sections."""
    client = get_supabase_client()

    response = client.table("songs").select(
        "*, song_sections(*)"
    ).eq("user_id", user_id).eq("id", str(song_id)).single().execute()

    if response.data:
        response.data["sections"] = response.data.pop("song_sections", [])

    return response.data


def create_song(user_id: str, song_data: SongCreate) -> dict:
    """Create a song with optional sections."""
    client = get_supabase_client()

    # Create song
    song_dict = {
        "user_id": user_id,
        "title": song_data.title,
        "artist": song_data.artist,
        "target_tempo": song_data.target_tempo,
    }

    response = client.table("songs").insert(song_dict).execute()
    song = response.data[0]

    # Create sections if provided
    sections = []
    if song_data.sections:
        section_dicts = [
            {
                "song_id": song["id"],
                "name": s.name,
                "order_index": s.order_index,
                "target_tempo": s.target_tempo,
                "notes": s.notes,
            }
            for s in song_data.sections
        ]
        section_response = client.table("song_sections").insert(section_dicts).execute()
        sections = section_response.data

    song["sections"] = sections
    return song


def update_song(user_id: str, song_id: UUID, song_data: SongUpdate) -> dict | None:
    """Update a song."""
    client = get_supabase_client()

    update_dict = song_data.model_dump(exclude_unset=True)
    if not update_dict:
        return get_song(user_id, song_id)

    response = client.table("songs").update(update_dict).eq(
        "user_id", user_id
    ).eq("id", str(song_id)).execute()

    if response.data:
        return get_song(user_id, song_id)
    return None


def delete_song(user_id: str, song_id: UUID) -> bool:
    """Delete a song (cascades to sections)."""
    client = get_supabase_client()

    response = client.table("songs").delete().eq(
        "user_id", user_id
    ).eq("id", str(song_id)).execute()

    return len(response.data) > 0


# Section operations
def create_section(user_id: str, song_id: UUID, section_data: SectionCreate) -> dict | None:
    """Create a section for a song."""
    client = get_supabase_client()

    # Verify song belongs to user
    song = get_song(user_id, song_id)
    if not song:
        return None

    section_dict = {
        "song_id": str(song_id),
        "name": section_data.name,
        "order_index": section_data.order_index,
        "target_tempo": section_data.target_tempo,
        "notes": section_data.notes,
    }

    response = client.table("song_sections").insert(section_dict).execute()
    return response.data[0] if response.data else None


def update_section(user_id: str, song_id: UUID, section_id: UUID, section_data: SectionUpdate) -> dict | None:
    """Update a section."""
    client = get_supabase_client()

    # Verify song belongs to user
    song = get_song(user_id, song_id)
    if not song:
        return None

    update_dict = section_data.model_dump(exclude_unset=True)
    if not update_dict:
        # Return existing section
        response = client.table("song_sections").select("*").eq("id", str(section_id)).single().execute()
        return response.data

    response = client.table("song_sections").update(update_dict).eq(
        "song_id", str(song_id)
    ).eq("id", str(section_id)).execute()

    return response.data[0] if response.data else None


def delete_section(user_id: str, song_id: UUID, section_id: UUID) -> bool:
    """Delete a section."""
    client = get_supabase_client()

    # Verify song belongs to user
    song = get_song(user_id, song_id)
    if not song:
        return False

    response = client.table("song_sections").delete().eq(
        "song_id", str(song_id)
    ).eq("id", str(section_id)).execute()

    return len(response.data) > 0

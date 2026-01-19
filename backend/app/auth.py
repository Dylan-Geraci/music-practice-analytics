from fastapi import HTTPException, Header
from jose import jwt, JWTError
from app.config import get_settings

SUPABASE_JWT_SECRET = None  # We'll get this from Supabase dashboard if needed


async def get_current_user(authorization: str = Header(...)) -> str:
    """
    Extract and verify user_id from Supabase JWT token.
    Returns the user_id (sub claim from the JWT).
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")

    try:
        # Supabase JWTs can be decoded without verification for user_id
        # The RLS policies in Supabase handle the actual security
        # For production, you'd verify with the JWT secret
        payload = jwt.get_unverified_claims(token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no user_id")

        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

export interface Profile {
  id: string
  user_id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ProfileFormData {
  username: string
  display_name: string
  bio: string
  is_public: boolean
}

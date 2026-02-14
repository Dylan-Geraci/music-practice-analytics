export interface Session {
  id: string
  user_id: string
  song_id: string | null
  section_id: string | null
  practiced_at: string
  duration_minutes: number
  tempo_bpm: number | null
  accuracy_rating: number | null
  difficulty_rating: number | null
  notes: string | null
  created_at: string
  song: { id: string; title: string; artist: string | null } | null
  section: { id: string; name: string } | null
}

export interface SessionFormData {
  song_id: string
  section_id: string
  practiced_at: string
  duration_minutes: string
  tempo_bpm: string
  accuracy_rating: string
  difficulty_rating: string
  notes: string
}

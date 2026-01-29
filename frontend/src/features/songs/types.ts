export interface Song {
  id: string
  user_id: string
  title: string
  artist: string | null
  target_tempo: number | null
  created_at: string
  updated_at: string
  song_sections: Section[]
}

export interface Section {
  id: string
  song_id: string
  name: string
  order_index: number
  target_tempo: number | null
  notes: string | null
  created_at: string
}

export interface SongFormData {
  title: string
  artist: string
  target_tempo: string
}

export interface SectionFormData {
  name: string
  order_index: string
  target_tempo: string
  notes: string
}

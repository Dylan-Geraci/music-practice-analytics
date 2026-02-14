-- Song sections table for breaking songs into practicable parts
CREATE TABLE IF NOT EXISTS song_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  order_index INTEGER NOT NULL DEFAULT 0,
  target_tempo INTEGER CHECK (target_tempo IS NULL OR (target_tempo > 0 AND target_tempo <= 400)),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies (access through parent song ownership)
ALTER TABLE song_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sections of their own songs"
  ON song_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM songs WHERE songs.id = song_sections.song_id AND songs.user_id = auth.uid()
  ));

CREATE POLICY "Users can create sections for their own songs"
  ON song_sections FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM songs WHERE songs.id = song_sections.song_id AND songs.user_id = auth.uid()
  ));

CREATE POLICY "Users can update sections of their own songs"
  ON song_sections FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM songs WHERE songs.id = song_sections.song_id AND songs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete sections of their own songs"
  ON song_sections FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM songs WHERE songs.id = song_sections.song_id AND songs.user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_song_sections_song_id ON song_sections(song_id);
CREATE INDEX idx_song_sections_order ON song_sections(song_id, order_index);

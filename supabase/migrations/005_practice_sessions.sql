-- Practice sessions table for logging individual practice entries
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
  section_id UUID REFERENCES song_sections(id) ON DELETE SET NULL,
  practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  tempo_bpm INTEGER CHECK (tempo_bpm IS NULL OR (tempo_bpm > 0 AND tempo_bpm <= 400)),
  accuracy_rating INTEGER CHECK (accuracy_rating IS NULL OR (accuracy_rating >= 1 AND accuracy_rating <= 5)),
  difficulty_rating INTEGER CHECK (difficulty_rating IS NULL OR (difficulty_rating >= 1 AND difficulty_rating <= 5)),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON practice_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_practiced_at ON practice_sessions(practiced_at DESC);
CREATE INDEX idx_practice_sessions_song_id ON practice_sessions(song_id);
CREATE INDEX idx_practice_sessions_section_id ON practice_sessions(section_id);
CREATE INDEX idx_practice_sessions_user_date ON practice_sessions(user_id, practiced_at DESC);

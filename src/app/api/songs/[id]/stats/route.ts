import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: songId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the song with sections
  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("*, song_sections(*)")
    .eq("id", songId)
    .eq("user_id", user.id)
    .single();

  if (songError || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  // Get all practice sessions for this song
  const { data: sessions } = await supabase
    .from("practice_sessions")
    .select("*, song_sections(id, name)")
    .eq("song_id", songId)
    .eq("user_id", user.id)
    .order("practiced_at", { ascending: true });

  // Tempo progress over time
  const tempoProgress = (sessions ?? [])
    .filter((s: Record<string, unknown>) => s.tempo_bpm)
    .map((s: Record<string, unknown>) => ({
      date: (s.practiced_at as string).split("T")[0],
      tempo: s.tempo_bpm as number,
      section: (s.song_sections as { name: string } | null)?.name || "General",
    }));

  // Accuracy trend
  const accuracyTrend = (sessions ?? [])
    .filter((s: Record<string, unknown>) => s.accuracy_rating)
    .map((s: Record<string, unknown>) => ({
      date: (s.practiced_at as string).split("T")[0],
      accuracy: s.accuracy_rating as number,
    }));

  // Total practice time
  const totalMinutes = (sessions ?? []).reduce(
    (sum: number, s: Record<string, unknown>) =>
      sum + (s.duration_minutes as number),
    0
  );

  // Per-section breakdown
  const sectionBreakdown: Record<
    string,
    { name: string; minutes: number; sessionCount: number }
  > = {};

  for (const session of sessions ?? []) {
    const sec = session.song_sections as { id: string; name: string } | null;
    const key = sec?.id || "general";
    const name = sec?.name || "General";
    if (!sectionBreakdown[key]) {
      sectionBreakdown[key] = { name, minutes: 0, sessionCount: 0 };
    }
    sectionBreakdown[key].minutes += session.duration_minutes;
    sectionBreakdown[key].sessionCount++;
  }

  return NextResponse.json({
    song,
    tempoProgress,
    accuracyTrend,
    totalMinutes,
    sessionCount: (sessions ?? []).length,
    sectionBreakdown: Object.values(sectionBreakdown),
  });
}

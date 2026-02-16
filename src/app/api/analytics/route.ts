import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all sessions
  const { data: sessions, error } = await supabase
    .from("practice_sessions")
    .select("practiced_at, duration_minutes, song_id, songs(id, title)")
    .eq("user_id", user.id)
    .order("practiced_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Practice time by day of week
  const byDayOfWeek: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Practice time by month
  const byMonth: Record<string, number> = {};

  // Most practiced songs
  const bySong: Record<string, { title: string; minutes: number }> = {};

  // Session durations over time (for trend)
  const sessionDurations: Array<{ date: string; duration: number }> = [];

  for (const session of sessions ?? []) {
    const date = new Date(session.practiced_at);
    const dayName = dayNames[date.getDay()];
    byDayOfWeek[dayName] += session.duration_minutes;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + session.duration_minutes;

    const song = session.songs as unknown as { id: string; title: string } | null;
    if (song) {
      if (!bySong[song.id]) {
        bySong[song.id] = { title: song.title, minutes: 0 };
      }
      bySong[song.id].minutes += session.duration_minutes;
    }

    sessionDurations.push({
      date: session.practiced_at.split("T")[0],
      duration: session.duration_minutes,
    });
  }

  // Format by day of week
  const practiceByDay = dayNames.map((day) => ({
    day,
    minutes: byDayOfWeek[day],
  }));

  // Format by month (last 12 months)
  const monthLabels: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  const practiceByMonth = monthLabels.map((key) => ({
    month: new Date(key + "-01").toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    }),
    minutes: byMonth[key] || 0,
  }));

  // Top songs (sorted by minutes, top 10)
  const topSongs = Object.values(bySong)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10);

  // Average session duration by month
  const sessionsByMonth: Record<string, number[]> = {};
  for (const session of sessions ?? []) {
    const date = new Date(session.practiced_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!sessionsByMonth[monthKey]) sessionsByMonth[monthKey] = [];
    sessionsByMonth[monthKey].push(session.duration_minutes);
  }
  const avgDurationByMonth = monthLabels.map((key) => {
    const durations = sessionsByMonth[key] || [];
    const avg =
      durations.length > 0
        ? Math.round(
            durations.reduce((a, b) => a + b, 0) / durations.length
          )
        : 0;
    return {
      month: new Date(key + "-01").toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      }),
      avgMinutes: avg,
    };
  });

  return NextResponse.json({
    practiceByDay,
    practiceByMonth,
    topSongs,
    avgDurationByMonth,
  });
}

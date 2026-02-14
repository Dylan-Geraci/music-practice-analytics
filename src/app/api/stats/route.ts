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

  // Get all sessions for the past year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  const { data: sessions, error } = await supabase
    .from("practice_sessions")
    .select("practiced_at, duration_minutes")
    .eq("user_id", user.id)
    .gte("practiced_at", oneYearAgo.toISOString())
    .order("practiced_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate daily totals for heatmap
  const dailyTotals: Record<string, number> = {};
  for (const session of sessions ?? []) {
    const date = session.practiced_at.split("T")[0];
    dailyTotals[date] = (dailyTotals[date] || 0) + session.duration_minutes;
  }

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get total practice time (all-time)
  const { data: allTimeSessions } = await supabase
    .from("practice_sessions")
    .select("duration_minutes")
    .eq("user_id", user.id);

  const totalMinutes =
    allTimeSessions?.reduce((sum, s) => sum + s.duration_minutes, 0) ?? 0;

  // Calculate streaks
  const sortedDates = Object.keys(dailyTotals).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check if today or yesterday has a session (for current streak)
  const todayStr = today.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Calculate longest streak
  if (sortedDates.length > 0) {
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Calculate current streak (must include today or yesterday)
  if (sortedDates.length > 0) {
    const lastDate = sortedDates[sortedDates.length - 1];
    if (lastDate === todayStr || lastDate === yesterdayStr) {
      currentStreak = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const curr = new Date(sortedDates[i + 1]);
        const prev = new Date(sortedDates[i]);
        const diffDays =
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Sessions this week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const { count: weeklySessionCount } = await supabase
    .from("practice_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("practiced_at", startOfWeek.toISOString());

  // Recent sessions
  const { data: recentSessions } = await supabase
    .from("practice_sessions")
    .select("*, songs(id, title, artist), song_sections(id, name)")
    .eq("user_id", user.id)
    .order("practiced_at", { ascending: false })
    .limit(10);

  const formattedRecent = (recentSessions ?? []).map(
    ({ songs, song_sections, ...rest }: Record<string, unknown>) => ({
      ...rest,
      song: songs,
      section: song_sections,
    })
  );

  return NextResponse.json({
    heatmap: dailyTotals,
    stats: {
      totalMinutes,
      currentStreak,
      longestStreak,
      weeklySessionCount: weeklySessionCount ?? 0,
    },
    recentSessions: formattedRecent,
  });
}

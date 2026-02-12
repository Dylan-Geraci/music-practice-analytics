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

  // Get active goals
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true);

  if (!goals || goals.length === 0) {
    return NextResponse.json({ progress: [] });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  // Start of week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  // Get today's sessions
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const { data: todaySessions } = await supabase
    .from("practice_sessions")
    .select("duration_minutes")
    .eq("user_id", user.id)
    .gte("practiced_at", todayStr)
    .lt("practiced_at", tomorrow.toISOString());

  // Get this week's sessions
  const { data: weekSessions } = await supabase
    .from("practice_sessions")
    .select("duration_minutes, practiced_at")
    .eq("user_id", user.id)
    .gte("practiced_at", startOfWeek.toISOString());

  const todayMinutes = (todaySessions ?? []).reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );
  const weekMinutes = (weekSessions ?? []).reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  // Count unique days with sessions this week
  const uniqueDays = new Set(
    (weekSessions ?? []).map((s) => s.practiced_at.split("T")[0])
  );
  const weekSessionDays = uniqueDays.size;

  const progress = goals.map(
    (goal: { id: string; type: string; target_value: number; [key: string]: unknown }) => {
      let current = 0;
      switch (goal.type) {
        case "daily_minutes":
          current = todayMinutes;
          break;
        case "weekly_minutes":
          current = weekMinutes;
          break;
        case "weekly_sessions":
          current = weekSessionDays;
          break;
      }

      return {
        goal,
        current,
        percentage: Math.min(
          100,
          Math.round((current / goal.target_value) * 100)
        ),
      };
    }
  );

  return NextResponse.json({ progress });
}

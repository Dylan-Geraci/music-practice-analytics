'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Flame,
  Clock,
  Plus,
  ArrowRight,
  Music,
  Lightbulb,
} from 'lucide-react'
import { useStats } from '@/features/dashboard/hooks/useStats'
import ActivityHeatmap from '@/features/dashboard/components/ActivityHeatmap'
import StatsRow from '@/features/dashboard/components/StatsRow'
import RecentSessions from '@/features/dashboard/components/RecentSessions'
import GoalProgressCard from '@/features/goals/components/GoalProgressCard'
import SessionForm from '@/features/sessions/components/SessionForm'

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-0">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[140px] w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today!'
  if (streak === 1) return 'Great start! Keep it going tomorrow.'
  if (streak < 7) return `${streak}-day streak! Keep it going!`
  if (streak < 30) return `${streak}-day streak! You're on fire!`
  return `${streak}-day streak! Incredible dedication!`
}

export default function DashboardPage() {
  const { data, isLoading, error } = useStats()
  const [logOpen, setLogOpen] = useState(false)

  const insights = useMemo(() => {
    if (!data) return null

    // Most practiced song this week from recent sessions
    const songCounts: Record<string, { title: string; id: string; minutes: number }> = {}
    for (const s of data.recentSessions) {
      if (!s.song) continue
      if (!songCounts[s.song.id]) {
        songCounts[s.song.id] = { title: s.song.title, id: s.song.id, minutes: 0 }
      }
      songCounts[s.song.id].minutes += s.duration_minutes
    }
    const topSong = Object.values(songCounts).sort((a, b) => b.minutes - a.minutes)[0] ?? null

    // Last practiced song (for "continue practicing" CTA)
    const lastSession = data.recentSessions[0] ?? null

    // Most active day of week from heatmap
    const dayTotals = [0, 0, 0, 0, 0, 0, 0]
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (const [dateStr, minutes] of Object.entries(data.heatmap)) {
      const day = new Date(dateStr + 'T12:00:00').getDay()
      dayTotals[day] += minutes
    }
    const maxDay = dayTotals.indexOf(Math.max(...dayTotals))
    const favoriteDay = dayTotals[maxDay] > 0 ? dayNames[maxDay] : null

    // Practiced today?
    const todayStr = new Date().toISOString().split('T')[0]
    const practicedToday = !!data.heatmap[todayStr]

    return { topSong, lastSession, favoriteDay, practicedToday }
  }, [data])

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load dashboard data.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { currentStreak, totalMinutes } = data.stats

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-600/20 bg-gradient-to-br from-emerald-600/15 via-emerald-600/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {currentStreak > 0 && <Flame className="h-6 w-6 text-emerald-400" />}
              <h1 className="text-2xl sm:text-3xl font-bold">
                {currentStreak > 0
                  ? `${currentStreak}-day streak`
                  : 'Welcome back'}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {getStreakMessage(currentStreak)}
            </p>
            {totalMinutes > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {formatDuration(totalMinutes)} total practice time
              </p>
            )}
          </div>
          <Button
            size="lg"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => setLogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Session
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <StatsRow
        totalMinutes={data.stats.totalMinutes}
        currentStreak={data.stats.currentStreak}
        longestStreak={data.stats.longestStreak}
        weeklySessionCount={data.stats.weeklySessionCount}
      />

      {/* Heatmap + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Heatmap + Recent Sessions stacked */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap data={data.heatmap} />
            </CardContent>
          </Card>

          <RecentSessions sessions={data.recentSessions} />
        </div>

        {/* Right: Quick Actions + Goals + Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {insights?.lastSession?.song && (
                <Link href={`/songs/${insights.lastSession.song.id}`} className="block">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                    <div className="p-1.5 rounded-md bg-emerald-600/10">
                      <Music className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">Continue practicing</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {insights.lastSession.song.title}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              )}
              <Link href="/songs" className="block">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                  <div className="p-1.5 rounded-md bg-emerald-600/10">
                    <Music className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">View Songs</p>
                    <p className="text-xs text-muted-foreground">Your repertoire</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
              <Link href="/sessions" className="block">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                  <div className="p-1.5 rounded-md bg-emerald-600/10">
                    <Clock className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">View Sessions</p>
                    <p className="text-xs text-muted-foreground">Practice history</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <GoalProgressCard />

          {/* Insights */}
          {insights && (insights.topSong || insights.favoriteDay) && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-500" />
                  <CardTitle className="text-base">Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.topSong && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Most practiced recently</p>
                    <p className="font-medium text-emerald-400">{insights.topSong.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDuration(insights.topSong.minutes)}</p>
                  </div>
                )}
                {insights.favoriteDay && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Most active day</p>
                    <p className="font-medium text-emerald-400">{insights.favoriteDay}</p>
                  </div>
                )}
                {!insights.practicedToday && currentStreak > 0 && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Practice today to keep your streak alive!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SessionForm open={logOpen} onOpenChange={setLogOpen} />
    </div>
  )
}

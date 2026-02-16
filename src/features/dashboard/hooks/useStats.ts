import { useQuery } from '@tanstack/react-query'

export interface StatsData {
  heatmap: Record<string, number>
  stats: {
    totalMinutes: number
    currentStreak: number
    longestStreak: number
    weeklySessionCount: number
  }
  recentSessions: Array<{
    id: string
    practiced_at: string
    duration_minutes: number
    tempo_bpm: number | null
    notes: string | null
    song: { id: string; title: string; artist: string | null } | null
    section: { id: string; name: string } | null
  }>
}

export function useStats() {
  return useQuery<StatsData>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
  })
}

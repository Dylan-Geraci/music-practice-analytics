import { useQuery } from '@tanstack/react-query'
import type { Song } from '@/features/songs/types'

export interface SongStatsData {
  song: Song
  tempoProgress: Array<{ date: string; tempo: number; section: string }>
  accuracyTrend: Array<{ date: string; accuracy: number }>
  totalMinutes: number
  sessionCount: number
  sectionBreakdown: Array<{ name: string; minutes: number; sessionCount: number }>
}

export function useSongStats(songId: string) {
  return useQuery<SongStatsData>({
    queryKey: ['song-stats', songId],
    queryFn: async () => {
      const res = await fetch(`/api/songs/${songId}/stats`)
      if (!res.ok) throw new Error('Failed to fetch song stats')
      return res.json()
    },
    enabled: !!songId,
  })
}

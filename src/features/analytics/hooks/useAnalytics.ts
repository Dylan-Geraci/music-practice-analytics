import { useQuery } from '@tanstack/react-query'

export interface AnalyticsData {
  practiceByDay: Array<{ day: string; minutes: number }>
  practiceByMonth: Array<{ month: string; minutes: number }>
  topSongs: Array<{ title: string; minutes: number }>
  avgDurationByMonth: Array<{ month: string; avgMinutes: number }>
}

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics')
      if (!res.ok) throw new Error('Failed to fetch analytics')
      return res.json()
    },
  })
}

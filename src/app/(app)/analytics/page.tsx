'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics'
import PracticeByDayChart from '@/features/analytics/components/PracticeByDayChart'
import PracticeByMonthChart from '@/features/analytics/components/PracticeByMonthChart'
import TopSongsChart from '@/features/analytics/components/TopSongsChart'
import AvgDurationChart from '@/features/analytics/components/AvgDurationChart'

export default function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load analytics.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PracticeByDayChart data={data.practiceByDay} />
        <PracticeByMonthChart data={data.practiceByMonth} />
        <TopSongsChart data={data.topSongs} />
        <AvgDurationChart data={data.avgDurationByMonth} />
      </div>
    </div>
  )
}

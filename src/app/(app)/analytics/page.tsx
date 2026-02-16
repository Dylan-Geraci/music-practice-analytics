'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3 } from 'lucide-react'
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics'
import PracticeByDayChart from '@/features/analytics/components/PracticeByDayChart'
import PracticeByMonthChart from '@/features/analytics/components/PracticeByMonthChart'
import TopSongsChart from '@/features/analytics/components/TopSongsChart'
import AvgDurationChart from '@/features/analytics/components/AvgDurationChart'

export default function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Loading your practice insights...</p>
        </div>
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your practice habits</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load analytics.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-600/10">
          <BarChart3 className="h-6 w-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Insights into your practice habits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PracticeByDayChart data={data.practiceByDay} />
        <PracticeByMonthChart data={data.practiceByMonth} />
        <TopSongsChart data={data.topSongs} />
        <AvgDurationChart data={data.avgDurationByMonth} />
      </div>
    </div>
  )
}

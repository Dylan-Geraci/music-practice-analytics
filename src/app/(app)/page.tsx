'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStats } from '@/features/dashboard/hooks/useStats'
import ActivityHeatmap from '@/features/dashboard/components/ActivityHeatmap'
import StatsRow from '@/features/dashboard/components/StatsRow'
import RecentSessions from '@/features/dashboard/components/RecentSessions'
import GoalProgressCard from '@/features/goals/components/GoalProgressCard'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
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
      <Card>
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent><Skeleton className="h-[140px] w-full" /></CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, error } = useStats()

  if (isLoading) {
    return <DashboardSkeleton />
  }

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <StatsRow
        totalMinutes={data.stats.totalMinutes}
        currentStreak={data.stats.currentStreak}
        longestStreak={data.stats.longestStreak}
        weeklySessionCount={data.stats.weeklySessionCount}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Practice Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={data.heatmap} />
        </CardContent>
      </Card>

      <GoalProgressCard />

      <RecentSessions sessions={data.recentSessions} />
    </div>
  )
}

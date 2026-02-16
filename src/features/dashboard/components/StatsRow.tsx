'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Clock, Flame, Trophy, Calendar } from 'lucide-react'

interface StatsRowProps {
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  weeklySessionCount: number
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export default function StatsRow({
  totalMinutes,
  currentStreak,
  longestStreak,
  weeklySessionCount,
}: StatsRowProps) {
  const stats = [
    {
      label: 'Total Practice',
      value: formatDuration(totalMinutes),
      icon: Clock,
      description: 'All time',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`,
      icon: Flame,
      description: 'Consecutive days',
    },
    {
      label: 'Longest Streak',
      value: `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`,
      icon: Trophy,
      description: 'Personal best',
    },
    {
      label: 'This Week',
      value: `${weeklySessionCount} session${weeklySessionCount !== 1 ? 's' : ''}`,
      icon: Calendar,
      description: 'Since Sunday',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-emerald-600/10">
                <stat.icon className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-emerald-400">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGoalProgress } from '../hooks/useGoalProgress'
import type { GoalType } from '../types'

const goalLabels: Record<GoalType, string> = {
  daily_minutes: 'Daily Practice',
  weekly_minutes: 'Weekly Practice',
  weekly_sessions: 'Weekly Sessions',
}

const goalUnits: Record<GoalType, string> = {
  daily_minutes: 'min',
  weekly_minutes: 'min',
  weekly_sessions: 'sessions',
}

export default function GoalProgressCard() {
  const { data, isLoading } = useGoalProgress()

  if (isLoading) return null

  const progress = data?.progress ?? []
  if (progress.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress.map((item) => (
            <div key={item.goal.id} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {goalLabels[item.goal.type as GoalType]}
                </span>
                <span className="text-muted-foreground">
                  {item.current}/{item.goal.target_value} {goalUnits[item.goal.type as GoalType]}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { useGoals, useCreateGoal, useDeleteGoal } from '../hooks/useGoals'
import type { GoalType } from '../types'

const goalLabels: Record<GoalType, string> = {
  daily_minutes: 'Daily Practice (minutes)',
  weekly_minutes: 'Weekly Practice (minutes)',
  weekly_sessions: 'Weekly Sessions (days)',
}

export default function GoalSettings() {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<GoalType>('daily_minutes')
  const [targetValue, setTargetValue] = useState('')

  const { data: goals, isLoading } = useGoals()
  const createGoal = useCreateGoal()
  const deleteGoal = useDeleteGoal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetValue) return

    try {
      await createGoal.mutateAsync({ type, target_value: targetValue })
      setTargetValue('')
      setShowForm(false)
    } catch (err) {
      console.error('Failed to create goal:', err)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Practice Goals</CardTitle>
        {!showForm && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading goals...</p>
        )}

        {goals && goals.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground">
            No goals set. Add a goal to track your practice targets.
          </p>
        )}

        {goals && goals.length > 0 && (
          <div className="space-y-2 mb-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/50"
              >
                <div>
                  <p className="text-sm font-medium">{goalLabels[goal.type]}</p>
                  <p className="text-xs text-muted-foreground">
                    Target: {goal.target_value}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => deleteGoal.mutate(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily_minutes">Daily Practice (minutes)</SelectItem>
                  <SelectItem value="weekly_minutes">Weekly Practice (minutes)</SelectItem>
                  <SelectItem value="weekly_sessions">Weekly Sessions (days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target</Label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                min={1}
                placeholder={type === 'weekly_sessions' ? '5' : '30'}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={createGoal.isPending}>
                {createGoal.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

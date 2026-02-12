export type GoalType = 'daily_minutes' | 'weekly_minutes' | 'weekly_sessions'

export interface Goal {
  id: string
  user_id: string
  type: GoalType
  target_value: number
  active: boolean
  created_at: string
}

export interface GoalFormData {
  type: GoalType
  target_value: string
}

export interface GoalProgress {
  goal: Goal
  current: number
  percentage: number
}

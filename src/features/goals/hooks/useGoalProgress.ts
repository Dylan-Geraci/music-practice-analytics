import { useQuery } from '@tanstack/react-query'
import type { GoalProgress } from '../types'

export function useGoalProgress() {
  return useQuery<{ progress: GoalProgress[] }>({
    queryKey: ['goal-progress'],
    queryFn: async () => {
      const res = await fetch('/api/goals/progress')
      if (!res.ok) throw new Error('Failed to fetch goal progress')
      return res.json()
    },
  })
}

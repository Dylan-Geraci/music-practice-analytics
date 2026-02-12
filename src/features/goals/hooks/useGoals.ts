import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Goal, GoalFormData } from '../types'

const GOALS_KEY = ['goals'] as const

export function useGoals() {
  const supabase = createClient()

  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Goal[]
    },
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (formData: GoalFormData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Deactivate existing goal of same type
      await supabase
        .from('goals')
        .update({ active: false })
        .eq('user_id', session.user.id)
        .eq('type', formData.type)
        .eq('active', true)

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: session.user.id,
          type: formData.type,
          target_value: parseInt(formData.target_value),
          active: true,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .update({ active: false })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

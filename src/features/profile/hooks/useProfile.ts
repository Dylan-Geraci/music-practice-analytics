import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ProfileFormData } from '../types'

const PROFILE_KEY = ['profile'] as const

export function useProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // No profile exists yet, return null
        return null
      }
      if (error) throw error
      return data as Profile
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Try upsert
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          username: formData.username.trim().toLowerCase() || null,
          display_name: formData.display_name.trim() || null,
          bio: formData.bio.trim() || null,
          is_public: formData.is_public,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY })
    },
  })
}

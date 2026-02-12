import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Session, SessionFormData } from '../types'

const SESSIONS_KEY = ['sessions'] as const

export function useSessions() {
  const supabase = createClient()

  return useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*, songs(id, title, artist), song_sections(id, name)')
        .order('practiced_at', { ascending: false })

      if (error) throw error
      return (data as unknown as Array<Omit<Session, 'song' | 'section'> & { songs: Session['song']; song_sections: Session['section'] }>).map(
        ({ songs, song_sections, ...rest }) => ({
          ...rest,
          song: songs,
          section: song_sections,
        })
      ) as Session[]
    },
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (formData: SessionFormData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: session.user.id,
          song_id: formData.song_id || null,
          section_id: formData.section_id || null,
          practiced_at: formData.practiced_at || new Date().toISOString(),
          duration_minutes: parseInt(formData.duration_minutes),
          tempo_bpm: formData.tempo_bpm ? parseInt(formData.tempo_bpm) : null,
          accuracy_rating: formData.accuracy_rating ? parseInt(formData.accuracy_rating) : null,
          difficulty_rating: formData.difficulty_rating ? parseInt(formData.difficulty_rating) : null,
          notes: formData.notes.trim() || null,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['goal-progress'] })
      toast.success('Session logged')
    },
    onError: () => {
      toast.error('Failed to log session')
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: SessionFormData }) => {
      const { data, error } = await supabase
        .from('practice_sessions')
        .update({
          song_id: formData.song_id || null,
          section_id: formData.section_id || null,
          practiced_at: formData.practiced_at || new Date().toISOString(),
          duration_minutes: parseInt(formData.duration_minutes),
          tempo_bpm: formData.tempo_bpm ? parseInt(formData.tempo_bpm) : null,
          accuracy_rating: formData.accuracy_rating ? parseInt(formData.accuracy_rating) : null,
          difficulty_rating: formData.difficulty_rating ? parseInt(formData.difficulty_rating) : null,
          notes: formData.notes.trim() || null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['goal-progress'] })
      toast.success('Session updated')
    },
    onError: () => {
      toast.error('Failed to update session')
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('practice_sessions')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['goal-progress'] })
      toast.success('Session deleted')
    },
    onError: () => {
      toast.error('Failed to delete session')
    },
  })
}

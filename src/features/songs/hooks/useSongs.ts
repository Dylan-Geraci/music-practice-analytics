import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Song, SongFormData } from '../types'

const SONGS_KEY = ['songs'] as const

export function useSongs() {
  const supabase = createClient()

  return useQuery({
    queryKey: SONGS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*, song_sections(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Song[]
    },
  })
}

export function useCreateSong() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (formData: SongFormData) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('songs')
        .insert({
          user_id: session.user.id,
          title: formData.title.trim(),
          artist: formData.artist.trim() || null,
          target_tempo: formData.target_tempo ? parseInt(formData.target_tempo) : null,
        })
        .select('*, song_sections(*)')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Song added')
    },
    onError: () => {
      toast.error('Failed to add song')
    },
  })
}

export function useUpdateSong() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: SongFormData }) => {
      const { data, error } = await supabase
        .from('songs')
        .update({
          title: formData.title.trim(),
          artist: formData.artist.trim() || null,
          target_tempo: formData.target_tempo ? parseInt(formData.target_tempo) : null,
        })
        .eq('id', id)
        .select('*, song_sections(*)')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Song updated')
    },
    onError: () => {
      toast.error('Failed to update song')
    },
  })
}

export function useDeleteSong() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Song deleted')
    },
    onError: () => {
      toast.error('Failed to delete song')
    },
  })
}

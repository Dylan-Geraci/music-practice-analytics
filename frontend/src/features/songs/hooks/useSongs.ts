import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Song, SongFormData } from '../types'

const SONGS_KEY = ['songs'] as const

export function useSongs() {
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
    },
  })
}

export function useUpdateSong() {
  const queryClient = useQueryClient()

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
    },
  })
}

export function useDeleteSong() {
  const queryClient = useQueryClient()

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
    },
  })
}

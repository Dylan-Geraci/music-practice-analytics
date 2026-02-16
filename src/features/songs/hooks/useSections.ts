import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { SectionFormData } from '../types'

const SONGS_KEY = ['songs'] as const

export function useCreateSection() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ songId, formData }: { songId: string; formData: SectionFormData }) => {
      const { data, error } = await supabase
        .from('song_sections')
        .insert({
          song_id: songId,
          name: formData.name.trim(),
          order_index: formData.order_index ? parseInt(formData.order_index) : 0,
          target_tempo: formData.target_tempo ? parseInt(formData.target_tempo) : null,
          notes: formData.notes.trim() || null,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Section added')
    },
    onError: () => {
      toast.error('Failed to add section')
    },
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: SectionFormData }) => {
      const { data, error } = await supabase
        .from('song_sections')
        .update({
          name: formData.name.trim(),
          order_index: formData.order_index ? parseInt(formData.order_index) : 0,
          target_tempo: formData.target_tempo ? parseInt(formData.target_tempo) : null,
          notes: formData.notes.trim() || null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Section updated')
    },
    onError: () => {
      toast.error('Failed to update section')
    },
  })
}

export function useDeleteSection() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('song_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_KEY })
      toast.success('Section deleted')
    },
    onError: () => {
      toast.error('Failed to delete section')
    },
  })
}

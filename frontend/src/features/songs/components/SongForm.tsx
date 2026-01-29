import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateSong, useUpdateSong } from '../hooks/useSongs'
import type { Song } from '../types'

interface SongFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  song?: Song
}

export default function SongForm({ open, onOpenChange, song }: SongFormProps) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [targetTempo, setTargetTempo] = useState('')

  const createSong = useCreateSong()
  const updateSong = useUpdateSong()
  const isEdit = !!song

  useEffect(() => {
    if (open) {
      setTitle(song?.title ?? '')
      setArtist(song?.artist ?? '')
      setTargetTempo(song?.target_tempo?.toString() ?? '')
    }
  }, [open, song])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = { title, artist, target_tempo: targetTempo }

    if (isEdit) {
      await updateSong.mutateAsync({ id: song.id, formData })
    } else {
      await createSong.mutateAsync(formData)
    }
    onOpenChange(false)
  }

  const loading = createSong.isPending || updateSong.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Song' : 'Add Song'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="song-title">Title</Label>
            <Input
              id="song-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="Song title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="song-artist">Artist</Label>
            <Input
              id="song-artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              maxLength={200}
              placeholder="Artist name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="song-tempo">Target Tempo (BPM)</Label>
            <Input
              id="song-tempo"
              type="number"
              value={targetTempo}
              onChange={(e) => setTargetTempo(e.target.value)}
              min={1}
              max={400}
              placeholder="120"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

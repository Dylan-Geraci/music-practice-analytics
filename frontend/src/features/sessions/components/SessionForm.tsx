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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSongs } from '@/features/songs/hooks/useSongs'
import { useCreateSession, useUpdateSession } from '../hooks/useSessions'
import type { Session } from '../types'

interface SessionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session?: Session
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function nowDatetimeLocal() {
  return toDatetimeLocal(new Date().toISOString())
}

export default function SessionForm({ open, onOpenChange, session }: SessionFormProps) {
  const [songId, setSongId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [practicedAt, setPracticedAt] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [tempoBpm, setTempoBpm] = useState('')
  const [accuracyRating, setAccuracyRating] = useState('')
  const [difficultyRating, setDifficultyRating] = useState('')
  const [notes, setNotes] = useState('')

  const { data: songs } = useSongs()
  const createSession = useCreateSession()
  const updateSession = useUpdateSession()
  const isEdit = !!session

  const selectedSong = songs?.find((s) => s.id === songId)
  const sections = selectedSong?.song_sections ?? []

  useEffect(() => {
    if (open) {
      setSongId(session?.song_id ?? '')
      setSectionId(session?.section_id ?? '')
      setPracticedAt(session?.practiced_at ? toDatetimeLocal(session.practiced_at) : nowDatetimeLocal())
      setDurationMinutes(session?.duration_minutes?.toString() ?? '')
      setTempoBpm(session?.tempo_bpm?.toString() ?? '')
      setAccuracyRating(session?.accuracy_rating?.toString() ?? '')
      setDifficultyRating(session?.difficulty_rating?.toString() ?? '')
      setNotes(session?.notes ?? '')
    }
  }, [open, session])

  useEffect(() => {
    setSectionId('')
  }, [songId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      song_id: songId,
      section_id: sectionId,
      practiced_at: practicedAt ? new Date(practicedAt).toISOString() : '',
      duration_minutes: durationMinutes,
      tempo_bpm: tempoBpm,
      accuracy_rating: accuracyRating,
      difficulty_rating: difficultyRating,
      notes,
    }

    try {
      if (isEdit) {
        await updateSession.mutateAsync({ id: session.id, formData })
      } else {
        await createSession.mutateAsync(formData)
      }
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save session:', err)
    }
  }

  const loading = createSession.isPending || updateSession.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Session' : 'Log Session'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-song">Song</Label>
            <Select value={songId} onValueChange={setSongId}>
              <SelectTrigger id="session-song" className="w-full">
                <SelectValue placeholder="Select a song (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No song</SelectItem>
                {songs?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}{s.artist ? ` — ${s.artist}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-section">Section</Label>
            <Select
              value={sectionId}
              onValueChange={setSectionId}
              disabled={!songId || songId === '__none' || sections.length === 0}
            >
              <SelectTrigger id="session-section" className="w-full">
                <SelectValue placeholder={!songId || songId === '__none' ? 'Select a song first' : sections.length === 0 ? 'No sections' : 'Select a section (optional)'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No section</SelectItem>
                {sections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-practiced-at">Practiced at</Label>
            <Input
              id="session-practiced-at"
              type="datetime-local"
              value={practicedAt}
              onChange={(e) => setPracticedAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">Duration (minutes)</Label>
            <Input
              id="session-duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
              min={1}
              max={1440}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-tempo">Tempo (BPM)</Label>
            <Input
              id="session-tempo"
              type="number"
              value={tempoBpm}
              onChange={(e) => setTempoBpm(e.target.value)}
              min={1}
              max={400}
              placeholder="120"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-accuracy">Accuracy</Label>
              <Select value={accuracyRating} onValueChange={setAccuracyRating}>
                <SelectTrigger id="session-accuracy" className="w-full">
                  <SelectValue placeholder="1-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-difficulty">Difficulty</Label>
              <Select value={difficultyRating} onValueChange={setDifficultyRating}>
                <SelectTrigger id="session-difficulty" className="w-full">
                  <SelectValue placeholder="1-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-notes">Notes</Label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="How did it go?"
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

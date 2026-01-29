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
import { useCreateSection, useUpdateSection } from '../hooks/useSections'
import type { Section } from '../types'

interface SectionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  songId: string
  section?: Section
}

export default function SectionForm({ open, onOpenChange, songId, section }: SectionFormProps) {
  const [name, setName] = useState('')
  const [orderIndex, setOrderIndex] = useState('')
  const [targetTempo, setTargetTempo] = useState('')
  const [notes, setNotes] = useState('')

  const createSection = useCreateSection()
  const updateSection = useUpdateSection()
  const isEdit = !!section

  useEffect(() => {
    if (open) {
      setName(section?.name ?? '')
      setOrderIndex(section?.order_index?.toString() ?? '0')
      setTargetTempo(section?.target_tempo?.toString() ?? '')
      setNotes(section?.notes ?? '')
    }
  }, [open, section])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = { name, order_index: orderIndex, target_tempo: targetTempo, notes }

    if (isEdit) {
      await updateSection.mutateAsync({ id: section.id, formData })
    } else {
      await createSection.mutateAsync({ songId, formData })
    }
    onOpenChange(false)
  }

  const loading = createSection.isPending || updateSection.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Section' : 'Add Section'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Name</Label>
            <Input
              id="section-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g. Intro, Verse, Chorus"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-order">Order</Label>
            <Input
              id="section-order"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(e.target.value)}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-tempo">Target Tempo (BPM)</Label>
            <Input
              id="section-tempo"
              type="number"
              value={targetTempo}
              onChange={(e) => setTargetTempo(e.target.value)}
              min={1}
              max={400}
              placeholder="120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-notes">Notes</Label>
            <textarea
              id="section-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Practice notes..."
              rows={3}
              className="border-input bg-background placeholder:text-muted-foreground flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useDeleteSection } from '../hooks/useSections'
import SectionForm from './SectionForm'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import type { Section } from '../types'

interface SectionListProps {
  songId: string
  sections: Section[]
}

export default function SectionList({ songId, sections }: SectionListProps) {
  const [addOpen, setAddOpen] = useState(false)
  const sorted = [...sections].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="pt-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Sections</h4>
        <Button variant="ghost" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No sections yet.</p>
      ) : (
        <div className="space-y-1">
          {sorted.map((section) => (
            <SectionRow key={section.id} songId={songId} section={section} />
          ))}
        </div>
      )}
      <SectionForm open={addOpen} onOpenChange={setAddOpen} songId={songId} />
    </div>
  )
}

function SectionRow({ songId, section }: { songId: string; section: Section }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteSection = useDeleteSection()

  const handleDelete = async () => {
    await deleteSection.mutateAsync(section.id)
    setDeleteOpen(false)
  }

  return (
    <div className="flex items-start justify-between py-2 px-3 rounded-md hover:bg-accent/50">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{section.name}</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {section.target_tempo && <span>{section.target_tempo} BPM</span>}
          {section.notes && (
            <span className="truncate max-w-48">{section.notes}</span>
          )}
        </div>
      </div>
      <div className="flex gap-1 ml-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <SectionForm
        open={editOpen}
        onOpenChange={setEditOpen}
        songId={songId}
        section={section}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Section"
        description={`This will permanently delete "${section.name}".`}
        loading={deleteSection.isPending}
      />
    </div>
  )
}

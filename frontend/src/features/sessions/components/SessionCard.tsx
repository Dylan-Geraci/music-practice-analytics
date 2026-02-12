import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteSession } from '../hooks/useSessions'
import SessionForm from './SessionForm'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import type { Session } from '../types'

interface SessionCardProps {
  session: Session
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function SessionCard({ session }: SessionCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteSession = useDeleteSession()

  const handleDelete = async () => {
    await deleteSession.mutateAsync(session.id)
    setDeleteOpen(false)
  }

  return (
    <>
      <Card>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {session.song ? session.song.title : 'No song'}
                </h3>
                {session.section && (
                  <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                    {session.section.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(session.practiced_at)} · {session.duration_minutes} min
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {session.tempo_bpm && (
                <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                  {session.tempo_bpm} BPM
                </span>
              )}
              {session.accuracy_rating && (
                <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                  Accuracy: {session.accuracy_rating}/5
                </span>
              )}
              {session.difficulty_rating && (
                <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                  Difficulty: {session.difficulty_rating}/5
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {session.notes && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {session.notes}
            </p>
          )}
        </div>
      </Card>
      <SessionForm open={editOpen} onOpenChange={setEditOpen} session={session} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Session"
        description="This will permanently delete this practice session."
        loading={deleteSession.isPending}
      />
    </>
  )
}

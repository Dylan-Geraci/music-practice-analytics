import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Pencil, Trash2, BarChart3 } from 'lucide-react'
import { useDeleteSong } from '../hooks/useSongs'
import SongForm from './SongForm'
import SectionList from './SectionList'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import type { Song } from '../types'

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteSong = useDeleteSong()

  const handleDelete = async () => {
    await deleteSong.mutateAsync(song.id)
    setDeleteOpen(false)
  }

  const sectionCount = song.song_sections.length

  return (
    <>
      <Card>
        <div
          className="px-6 py-4 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold">{song.title}</h3>
              {song.artist && (
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {song.target_tempo && (
                <span className="text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5">
                  {song.target_tempo} BPM
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
              </span>
              <Link href={`/songs/${song.id}`} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditOpen(true)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        {expanded && (
          <div className="px-6 pb-4 border-t">
            <SectionList songId={song.id} sections={song.song_sections} />
          </div>
        )}
      </Card>
      <SongForm open={editOpen} onOpenChange={setEditOpen} song={song} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete Song"
        description={`This will permanently delete "${song.title}" and all its sections.`}
        loading={deleteSong.isPending}
      />
    </>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Music } from 'lucide-react'
import { useSongs } from '@/features/songs/hooks/useSongs'
import SongCard from '@/features/songs/components/SongCard'
import SongForm from '@/features/songs/components/SongForm'

export default function SongsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const { data: songs, isLoading, error } = useSongs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-olive-muted">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif">Songs</h1>
            <p className="text-muted-foreground text-sm">Your repertoire</p>
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Song
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load songs. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {songs && songs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              No songs yet. Add your first song to get started.
            </p>
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </CardContent>
        </Card>
      )}

      {songs && songs.length > 0 && (
        <div className="space-y-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      <SongForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

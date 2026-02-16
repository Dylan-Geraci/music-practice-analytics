'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Clock, Filter } from 'lucide-react'
import { useSessions } from '@/features/sessions/hooks/useSessions'
import SessionCard from '@/features/sessions/components/SessionCard'
import SessionForm from '@/features/sessions/components/SessionForm'
import { cn } from '@/lib/utils'

export default function SessionsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [songFilter, setSongFilter] = useState<string | null>(null)
  const { data: sessions, isLoading, error } = useSessions()

  // Build song filter options from existing sessions
  const songOptions = useMemo(() => {
    if (!sessions) return []
    const map = new Map<string, { id: string; title: string; count: number }>()
    for (const s of sessions) {
      if (!s.song) continue
      const existing = map.get(s.song.id)
      if (existing) {
        existing.count++
      } else {
        map.set(s.song.id, { id: s.song.id, title: s.song.title, count: 1 })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [sessions])

  const filteredSessions = useMemo(() => {
    if (!sessions) return []
    if (!songFilter) return sessions
    return sessions.filter((s) => s.song?.id === songFilter)
  }, [sessions, songFilter])

  const showFilter = songOptions.length > 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-600/10">
            <Clock className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-muted-foreground text-sm">Your practice history</p>
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Session
        </Button>
      </div>

      {/* Song Filter */}
      {showFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => setSongFilter(null)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              songFilter === null
                ? 'bg-emerald-600/15 text-emerald-400 border-emerald-600/30'
                : 'bg-transparent text-muted-foreground border-border hover:border-emerald-600/30 hover:text-foreground'
            )}
          >
            All ({sessions?.length ?? 0})
          </button>
          {songOptions.map((song) => (
            <button
              key={song.id}
              onClick={() => setSongFilter(songFilter === song.id ? null : song.id)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors border truncate max-w-[200px]',
                songFilter === song.id
                  ? 'bg-emerald-600/15 text-emerald-400 border-emerald-600/30'
                  : 'bg-transparent text-muted-foreground border-border hover:border-emerald-600/30 hover:text-foreground'
              )}
            >
              {song.title} ({song.count})
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load sessions. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {sessions && sessions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              No sessions yet. Log your first practice session to get started.
            </p>
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Session
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredSessions.length > 0 && (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {songFilter && filteredSessions.length === 0 && sessions && sessions.length > 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No sessions for this song.</p>
          </CardContent>
        </Card>
      )}

      <SessionForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

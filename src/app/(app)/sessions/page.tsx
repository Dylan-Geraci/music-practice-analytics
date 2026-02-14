'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Clock } from 'lucide-react'
import { useSessions } from '@/features/sessions/hooks/useSessions'
import SessionCard from '@/features/sessions/components/SessionCard'
import SessionForm from '@/features/sessions/components/SessionForm'

export default function SessionsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const { data: sessions, isLoading, error } = useSessions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Session
        </Button>
      </div>

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

      {sessions && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      <SessionForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

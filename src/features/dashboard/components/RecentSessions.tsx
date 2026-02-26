'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StatsData } from '../hooks/useStats'

interface RecentSessionsProps {
  sessions: StatsData['recentSessions']
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No sessions yet. Start practicing to see your activity here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Sessions</CardTitle>
        <Link href="/sessions" className="text-xs text-primary hover:text-primary/80 transition-colors">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {session.song ? (
                    <Link
                      href={`/songs/${session.song.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {session.song.title}
                    </Link>
                  ) : (
                    'General Practice'
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(session.practiced_at)}
                  {session.section && ` · ${session.section.name}`}
                </p>
              </div>
              <div className="ml-4 shrink-0 text-right">
                <p className="text-sm font-medium text-primary">{session.duration_minutes} min</p>
                {session.tempo_bpm && (
                  <p className="text-xs text-muted-foreground">{session.tempo_bpm} BPM</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

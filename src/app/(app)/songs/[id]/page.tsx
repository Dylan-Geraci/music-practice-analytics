'use client'

import { use } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Clock, Hash, Music } from 'lucide-react'
import { useSongStats } from '@/features/analytics/hooks/useSongStats'
import TempoChart from '@/features/analytics/components/TempoChart'

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export default function SongDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error } = useSongStats(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-0">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[250px] w-full" /></CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link href="/songs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Songs
          </Button>
        </Link>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Failed to load song details.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/songs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{data.song.title}</h1>
          {data.song.artist && (
            <p className="text-muted-foreground">{data.song.artist}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-emerald-600/10">
                <Clock className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Practice</p>
                <p className="text-lg font-semibold text-emerald-400">{formatDuration(data.totalMinutes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-emerald-600/10">
                <Hash className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sessions</p>
                <p className="text-lg font-semibold text-emerald-400">{data.sessionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {data.song.target_tempo && (
          <Card>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-emerald-600/10">
                  <Music className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Tempo</p>
                  <p className="text-lg font-semibold text-emerald-400">{data.song.target_tempo} BPM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tempo chart */}
      <TempoChart data={data.tempoProgress} targetTempo={data.song.target_tempo} />

      {/* Section breakdown */}
      {data.sectionBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Per-Section Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.sectionBreakdown.map((section) => (
                <div
                  key={section.name}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{section.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.sessionCount} session{section.sessionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">{formatDuration(section.minutes)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

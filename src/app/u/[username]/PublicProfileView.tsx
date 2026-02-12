'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, Flame, Hash, Music, Share2, Check } from 'lucide-react'
import ActivityHeatmap from '@/features/dashboard/components/ActivityHeatmap'
import type { Profile } from '@/features/profile/types'

interface PublicProfileViewProps {
  profile: Profile
  heatmap: Record<string, number>
  stats: {
    totalMinutes: number
    currentStreak: number
    totalSessions: number
  }
  songs: Array<{ id: string; title: string; artist: string | null }>
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export default function PublicProfileView({
  profile,
  heatmap,
  stats,
  songs,
}: PublicProfileViewProps) {
  const [copied, setCopied] = useState(false)
  const displayName = profile.display_name || profile.username || 'Musician'
  const initial = displayName.charAt(0).toUpperCase()

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile header */}
        <div className="flex items-start gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{initial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {profile.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
            {profile.bio && (
              <p className="text-sm mt-2 text-muted-foreground">{profile.bio}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Practice</p>
                  <p className="text-lg font-semibold">{formatDuration(stats.totalMinutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                  <p className="text-lg font-semibold">{stats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="text-lg font-semibold">{stats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Practice Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={heatmap} />
          </CardContent>
        </Card>

        {/* Songs */}
        {songs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Song Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <Music className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      {song.artist && (
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

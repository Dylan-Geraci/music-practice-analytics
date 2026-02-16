import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PublicProfileView from './PublicProfileView'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, username')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) {
    return { title: 'Profile Not Found' }
  }

  const name = profile.display_name || profile.username
  return {
    title: `${name} - SessionLog`,
    description: profile.bio || `Check out ${name}'s practice stats on SessionLog`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) {
    notFound()
  }

  // Get practice stats for this user
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('practiced_at, duration_minutes')
    .eq('user_id', profile.user_id)
    .gte('practiced_at', oneYearAgo.toISOString())
    .order('practiced_at', { ascending: true })

  // Aggregate heatmap data
  const heatmap: Record<string, number> = {}
  let totalMinutes = 0
  for (const session of sessions ?? []) {
    const date = session.practiced_at.split('T')[0]
    heatmap[date] = (heatmap[date] || 0) + session.duration_minutes
    totalMinutes += session.duration_minutes
  }

  // Calculate current streak
  const sortedDates = Object.keys(heatmap).sort()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let currentStreak = 0
  if (sortedDates.length > 0) {
    const lastDate = sortedDates[sortedDates.length - 1]
    if (lastDate === todayStr || lastDate === yesterdayStr) {
      currentStreak = 1
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const curr = new Date(sortedDates[i + 1])
        const prev = new Date(sortedDates[i])
        const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        if (diffDays === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }
  }

  // Get all-time total
  const { data: allTimeSessions } = await supabase
    .from('practice_sessions')
    .select('duration_minutes')
    .eq('user_id', profile.user_id)

  const allTimeMinutes = (allTimeSessions ?? []).reduce(
    (sum, s) => sum + s.duration_minutes, 0
  )

  // Get songs (only if public)
  const { data: songs } = await supabase
    .from('songs')
    .select('id, title, artist')
    .eq('user_id', profile.user_id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <PublicProfileView
      profile={profile}
      heatmap={heatmap}
      stats={{
        totalMinutes: allTimeMinutes,
        currentStreak,
        totalSessions: (allTimeSessions ?? []).length,
      }}
      songs={songs ?? []}
    />
  )
}

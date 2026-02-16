'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'

export default function ProfileSettings() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
      setDisplayName(profile.display_name ?? '')
      setBio(profile.bio ?? '')
      setIsPublic(profile.is_public)
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      await updateProfile.mutateAsync({
        username,
        display_name: displayName,
        bio,
        is_public: isPublic,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile'
      if (msg.includes('duplicate') || msg.includes('unique')) {
        setError('This username is already taken.')
      } else {
        setError(msg)
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground mx-auto" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Public Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              pattern="^[a-z0-9_-]{3,30}$"
              title="3-30 lowercase letters, numbers, hyphens, or underscores"
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground">
              Your profile URL will be: /u/{username || 'username'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your musical journey..."
              rows={3}
              maxLength={500}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is-public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="is-public" className="text-sm font-normal">
              Make my profile public
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-500">Profile updated successfully!</p>
          )}

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

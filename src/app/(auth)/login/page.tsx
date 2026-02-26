'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '../components/AuthLayout'
import { checkLoginLock, recordFailedAttempt, clearFailedAttempts } from '@/lib/auth-validation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [minutesRemaining, setMinutesRemaining] = useState(0)
  const { signIn } = useAuth()
  const router = useRouter()

  const refreshLockStatus = useCallback(() => {
    if (!email) return
    const status = checkLoginLock(email)
    setLocked(status.locked)
    setMinutesRemaining(status.minutesRemaining)
  }, [email])

  // Refresh lock status when email changes and periodically while locked
  useEffect(() => {
    refreshLockStatus()
    if (!locked) return
    const interval = setInterval(refreshLockStatus, 30000)
    return () => clearInterval(interval)
  }, [locked, refreshLockStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Check lock before attempting
    const lockStatus = checkLoginLock(email)
    if (lockStatus.locked) {
      setLocked(true)
      setMinutesRemaining(lockStatus.minutesRemaining)
      return
    }

    setLoading(true)

    const { error } = await signIn(email, password)

    setLoading(false)

    if (error) {
      const result = recordFailedAttempt(email)
      if (result.locked) {
        setLocked(true)
        setMinutesRemaining(15)
        setError(null)
      } else {
        setError(`${error.message} (${result.attemptsRemaining} attempt${result.attemptsRemaining === 1 ? '' : 's'} remaining)`)
      }
    } else {
      clearFailedAttempts(email)
      router.push('/')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight font-serif">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={locked}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={locked}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {locked && (
            <p className="text-sm text-destructive">
              Too many failed attempts. Try again in {minutesRemaining} minute{minutesRemaining === 1 ? '' : 's'}.
            </p>
          )}
          {error && !locked && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
            disabled={loading || locked}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

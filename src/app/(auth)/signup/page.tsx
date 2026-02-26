'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, BarChart3, Target, Mail, Eye, EyeOff, Check, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '../components/AuthLayout'
import { validatePassword, getPasswordStrength, PASSWORD_RULES } from '@/lib/auth-validation'

const features = [
  { icon: <Clock className="h-5 w-5" />, text: 'Track every session' },
  { icon: <BarChart3 className="h-5 w-5" />, text: 'Visualize your progress' },
  { icon: <Target className="h-5 w-5" />, text: 'Set goals & build streaks' },
]

const strengthConfig = {
  weak: { color: 'bg-red-500', width: 'w-1/3', label: 'Weak' },
  medium: { color: 'bg-yellow-500', width: 'w-2/3', label: 'Medium' },
  strong: { color: 'bg-green-500', width: 'w-full', label: 'Strong' },
} as const

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const strength = getPasswordStrength(password)
  const strengthStyle = strengthConfig[strength]
  const showRequirements = passwordFocused || password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = validatePassword(password)
    if (!validation.valid) {
      setError('Password must meet all requirements: ' + validation.errors.join(', '))
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error, session } = await signUp(email, password)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else if (session) {
      router.push('/')
    } else {
      setCheckEmail(true)
    }
  }

  if (checkEmail) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-olive-muted p-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-serif">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to
            activate your account.
          </p>
          <Link
            href="/login"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout features={features}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight font-serif">Create an account</h2>
          <p className="text-sm text-muted-foreground">
            Start tracking your practice today
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
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                minLength={8}
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
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strengthStyle.color} ${strengthStyle.width}`} />
                  </div>
                  <span className={`text-xs font-medium ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {strengthStyle.label}
                  </span>
                </div>
              </div>
            )}
            {showRequirements && (
              <ul className="space-y-1 mt-2">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test instanceof RegExp ? rule.test.test(password) : rule.test(password)
                  return (
                    <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

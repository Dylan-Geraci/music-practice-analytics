// Password validation rules
export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (s: string) => s.length >= 8 },
  { label: 'Uppercase letter', test: /[A-Z]/ },
  { label: 'Lowercase letter', test: /[a-z]/ },
  { label: 'Number', test: /[0-9]/ },
  { label: 'Special character (!@#$%^&*...)', test: /[^A-Za-z0-9]/ },
] as const satisfies readonly { label: string; test: RegExp | ((s: string) => boolean) }[]

function testRule(rule: (typeof PASSWORD_RULES)[number], password: string): boolean {
  return rule.test instanceof RegExp ? rule.test.test(password) : rule.test(password)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  for (const rule of PASSWORD_RULES) {
    if (!testRule(rule, password)) {
      errors.push(rule.label)
    }
  }
  return { valid: errors.length === 0, errors }
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const passed = PASSWORD_RULES.filter((rule) => testRule(rule, password)).length
  if (passed >= 5) return 'strong'
  if (passed >= 3) return 'medium'
  return 'weak'
}

// Rate limiting (localStorage-based)
const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

interface LoginAttemptData {
  count: number
  lockedUntil: number | null
}

function getStorageKey(email: string): string {
  return `login_attempts_${email}`
}

function getAttemptData(email: string): LoginAttemptData {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null }
  try {
    const raw = localStorage.getItem(getStorageKey(email))
    if (!raw) return { count: 0, lockedUntil: null }
    return JSON.parse(raw) as LoginAttemptData
  } catch {
    return { count: 0, lockedUntil: null }
  }
}

function setAttemptData(email: string, data: LoginAttemptData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey(email), JSON.stringify(data))
}

export function checkLoginLock(email: string): { locked: boolean; minutesRemaining: number } {
  const data = getAttemptData(email)
  if (!data.lockedUntil) return { locked: false, minutesRemaining: 0 }

  const remaining = data.lockedUntil - Date.now()
  if (remaining <= 0) {
    clearFailedAttempts(email)
    return { locked: false, minutesRemaining: 0 }
  }

  return { locked: true, minutesRemaining: Math.ceil(remaining / 60000) }
}

export function recordFailedAttempt(email: string): { attemptsRemaining: number; locked: boolean } {
  const data = getAttemptData(email)
  data.count += 1

  if (data.count >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000
    setAttemptData(email, data)
    return { attemptsRemaining: 0, locked: true }
  }

  setAttemptData(email, data)
  return { attemptsRemaining: MAX_ATTEMPTS - data.count, locked: false }
}

export function clearFailedAttempts(email: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getStorageKey(email))
}

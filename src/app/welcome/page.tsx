'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── Heatmap color helper ── */
const HEATMAP_COLORS = [
  'bg-secondary',            // 0 — empty
  'bg-primary/20',           // 1
  'bg-primary/40',           // 2
  'bg-primary/60',           // 3
  'bg-primary',              // 4 — max
]

// Deterministic mock grid (7 rows x 20 cols)
const MOCK_HEATMAP = [
  [0,1,0,2,1,0,0,3,1,0,2,0,1,0,0,2,1,0,1,0],
  [1,0,2,0,0,1,2,0,0,1,0,3,0,1,0,0,2,1,0,1],
  [0,2,1,3,2,0,1,0,2,0,1,0,2,0,3,1,0,0,2,0],
  [2,0,0,1,0,3,0,2,1,0,0,2,0,4,1,0,1,2,0,1],
  [0,1,3,0,2,1,0,0,1,2,0,1,0,0,2,0,3,0,1,0],
  [1,0,0,2,0,0,4,1,0,3,2,0,1,0,0,2,0,1,0,2],
  [0,0,1,0,1,2,0,0,2,0,0,1,3,2,0,1,0,0,1,0],
]

export default function WelcomePage() {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = previewRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-serif font-bold tracking-tight">
            SessionLog
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="paper-grain relative overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 pb-20 text-center">
          {/* Metronome */}
          <div className="hero-animate mb-8">
            <svg
              width="80"
              height="96"
              viewBox="0 0 80 96"
              overflow="visible"
              fill="none"
              className="mx-auto"
              aria-hidden="true"
            >
              {/* Base */}
              <rect x="24" y="80" width="32" height="12" rx="3" fill="currentColor" className="text-primary/30" />
              {/* Arm */}
              <g style={{ transformOrigin: '40px 80px', animation: 'metronome-swing 2s ease-in-out infinite' }}>
                <line x1="40" y1="80" x2="40" y2="16" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
                {/* Weight */}
                <rect x="34" y="36" width="12" height="8" rx="2" fill="currentColor" className="text-primary" />
                {/* Tip */}
                <circle cx="40" cy="16" r="4" fill="currentColor" className="text-primary/60" />
              </g>
            </svg>
          </div>

          <h1 className="hero-animate-delay-1 text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
            Built for musicians who{' '}
            <span className="squiggly-underline">practice</span>.
          </h1>

          <p className="hero-animate-delay-2 mt-6 max-w-lg text-lg text-muted-foreground">
            Track your sessions, spot patterns, and grow as a player — all in
            one calm, focused space.
          </p>

          <Link
            href="/signup"
            className="hero-animate-delay-3 mt-8 inline-block rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ── Visual Preview ── */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div ref={previewRef} className="scroll-reveal">
          <h2 className="text-center text-2xl sm:text-3xl font-serif font-bold mb-12">
            See your practice at a glance.
          </h2>

          {/* Browser mockup */}
          <div
            className="mx-auto max-w-3xl rounded-xl border border-border bg-card shadow-lg overflow-hidden"
            style={{ animation: 'gentle-float 4s ease-in-out infinite' }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <span className="h-3 w-3 rounded-full bg-green-400/70" />
              <span className="ml-3 text-xs text-muted-foreground select-none">
                SessionLog — Dashboard
              </span>
            </div>

            {/* Mock dashboard content */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Hours', value: '42h' },
                  { label: 'Current Streak', value: '7 days' },
                  { label: 'Best Streak', value: '14 days' },
                  { label: 'This Week', value: '5' },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-sm sm:text-base font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Heatmap */}
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium mb-3">Practice Activity</p>
                <div className="flex flex-col gap-[3px]">
                  {MOCK_HEATMAP.map((row, r) => (
                    <div key={r} className="flex gap-[3px]">
                      {row.map((v, c) => (
                        <div
                          key={c}
                          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm ${HEATMAP_COLORS[v]}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent sessions */}
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-medium mb-3">Recent Sessions</p>
                <div className="space-y-2">
                  {[
                    { song: 'Clair de Lune', dur: '35 min', date: 'Today' },
                    { song: 'Prelude in C Major', dur: '20 min', date: 'Yesterday' },
                    { song: 'Nocturne Op. 9 No. 2', dur: '45 min', date: '2 days ago' },
                  ].map((s) => (
                    <div key={s.song} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium truncate">{s.song}</span>
                      <div className="flex items-center gap-3 text-muted-foreground shrink-0">
                        <span>{s.dur}</span>
                        <span className="hidden sm:inline">{s.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-sm text-muted-foreground">
          <span>Built by Dylan Geraci</span>
          <span className="text-muted-foreground/50">·</span>
          <a
            href="https://dylangeraci.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            dylangeraci.com
          </a>
        </div>
      </footer>
    </div>
  )
}

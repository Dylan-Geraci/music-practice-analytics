import { Music } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  features?: { icon: ReactNode; text: string }[]
}

export function AuthLayout({ children, features }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center p-12 text-white relative overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.5 0.17 162 / 0.6), transparent),
            radial-gradient(ellipse 70% 50% at 80% 70%, oklch(0.35 0.15 200 / 0.5), transparent),
            radial-gradient(ellipse 90% 80% at 50% 50%, oklch(0.4 0.12 170 / 0.3), transparent),
            oklch(0.15 0.02 200)
          `,
        }}
      >
        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <Music className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Practice Analytics</h1>
            <p className="mt-2 text-sm text-white/70">
              Track your progress. Build your streak.
            </p>
          </div>

          {features && features.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 text-left w-full">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
                  <span className="text-emerald-300">{feature.icon}</span>
                  <span className="text-sm font-medium text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

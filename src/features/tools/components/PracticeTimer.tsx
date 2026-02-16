'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Square, RotateCcw } from 'lucide-react'
import SessionForm from '@/features/sessions/components/SessionForm'

export default function PracticeTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showLogForm, setShowLogForm] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setSeconds(0)
  }, [stop])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const hours = Math.floor(minutes / 60)
  const displayMins = minutes % 60

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}:${String(displayMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(displayMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleLogSession = () => {
    stop()
    setShowLogForm(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Practice Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-5xl font-bold tabular-nums font-mono">
              {formatTime()}
            </div>
            {minutes > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {minutes} minute{minutes !== 1 ? 's' : ''} practiced
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button
              size="lg"
              onClick={isRunning ? stop : start}
              className="w-32"
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {seconds > 0 ? 'Resume' : 'Start'}
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Log session button */}
          {seconds >= 60 && (
            <div className="text-center">
              <Button variant="secondary" onClick={handleLogSession}>
                Log {minutes} min session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SessionForm
        open={showLogForm}
        onOpenChange={(open) => {
          setShowLogForm(open)
          if (!open && !isRunning) {
            reset()
          }
        }}
      />
    </>
  )
}

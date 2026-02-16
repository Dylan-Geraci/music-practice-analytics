'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Square, Minus, Plus } from 'lucide-react'

export default function Metronome() {
  const [bpm, setBpm] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const tapTimesRef = useRef<number[]>([])

  const playClick = useCallback((isAccent: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = isAccent ? 1000 : 800
    gain.gain.value = isAccent ? 0.3 : 0.15

    const now = ctx.currentTime
    osc.start(now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    osc.stop(now + 0.1)
  }, [])

  const start = useCallback(() => {
    setIsPlaying(true)
    setBeat(0)
    let currentBeat = 0

    const tick = () => {
      playClick(currentBeat % beatsPerMeasure === 0)
      setBeat(currentBeat % beatsPerMeasure)
      currentBeat++
    }

    tick()
    intervalRef.current = setInterval(tick, (60 / bpm) * 1000)
  }, [bpm, beatsPerMeasure, playClick])

  const stop = useCallback(() => {
    setIsPlaying(false)
    setBeat(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Restart when bpm changes while playing
  useEffect(() => {
    if (isPlaying) {
      stop()
      // Small delay to prevent audio glitch
      const timer = setTimeout(() => start(), 50)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, beatsPerMeasure])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleTapTempo = () => {
    const now = Date.now()
    tapTimesRef.current.push(now)

    // Keep last 4 taps
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current = tapTimesRef.current.slice(-4)
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals = []
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const newBpm = Math.round(60000 / avgInterval)
      if (newBpm >= 20 && newBpm <= 300) {
        setBpm(newBpm)
      }
    }

    // Reset if gap is too large
    if (tapTimesRef.current.length >= 2) {
      const last = tapTimesRef.current[tapTimesRef.current.length - 1]
      const prev = tapTimesRef.current[tapTimesRef.current.length - 2]
      if (last - prev > 3000) {
        tapTimesRef.current = [now]
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Metronome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* BPM Display */}
        <div className="text-center">
          <div className="text-5xl font-bold tabular-nums">{bpm}</div>
          <div className="text-sm text-muted-foreground mt-1">BPM</div>
        </div>

        {/* BPM Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBpm((b) => Math.max(20, b - 5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="range"
            min={20}
            max={300}
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-48 h-2 accent-primary"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBpm((b) => Math.min(300, b + 5))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Beat visualization */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full transition-colors ${
                isPlaying && beat === i
                  ? i === 0
                    ? 'bg-emerald-400'
                    : 'bg-primary'
                  : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {/* Time signature */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Beats:</span>
          {[2, 3, 4, 6].map((n) => (
            <Button
              key={n}
              variant={beatsPerMeasure === n ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBeatsPerMeasure(n)}
            >
              {n}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            onClick={isPlaying ? stop : start}
            className="w-32"
          >
            {isPlaying ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={handleTapTempo}>
            Tap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

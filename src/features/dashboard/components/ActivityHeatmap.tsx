'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

interface ActivityHeatmapProps {
  data: Record<string, number>
}

function getColor(minutes: number): string {
  if (minutes === 0) return 'bg-secondary'
  if (minutes < 15) return 'bg-primary/20'
  if (minutes < 30) return 'bg-primary/40'
  if (minutes < 60) return 'bg-primary/70'
  return 'bg-primary'
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    date: string
    minutes: number
    x: number
    y: number
  } | null>(null)

  const { weeks, months } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Go back ~52 weeks to the nearest Sunday
    const start = new Date(today)
    start.setDate(start.getDate() - 364)
    // Align to Sunday
    start.setDate(start.getDate() - start.getDay())

    const weeks: Array<Array<{ date: Date; dateStr: string; minutes: number }>> = []
    const months: Array<{ label: string; col: number }> = []
    let currentWeek: Array<{ date: Date; dateStr: string; minutes: number }> = []
    let lastMonth = -1

    const cursor = new Date(start)
    let weekIndex = 0

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split('T')[0]
      const minutes = data[dateStr] || 0

      if (cursor.getMonth() !== lastMonth) {
        lastMonth = cursor.getMonth()
        months.push({
          label: cursor.toLocaleDateString(undefined, { month: 'short' }),
          col: weekIndex,
        })
      }

      currentWeek.push({
        date: new Date(cursor),
        dateStr,
        minutes,
      })

      if (cursor.getDay() === 6) {
        weeks.push(currentWeek)
        currentWeek = []
        weekIndex++
      }

      cursor.setDate(cursor.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return { weeks, months }
  }, [data])

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1 min-w-fit">
        {/* Month labels */}
        <div className="relative ml-8" style={{ height: 18 }}>
          {months.map((month, i) => {
            // Skip label if it would overlap with the next one (less than 3 columns apart)
            const next = months[i + 1]
            if (next && next.col - month.col < 3) return null
            return (
              <span
                key={`${month.label}-${i}`}
                className="absolute text-[10px] text-muted-foreground"
                style={{ left: month.col * 15 }}
              >
                {month.label}
              </span>
            )
          })}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="h-[13px] w-6 text-[10px] text-muted-foreground flex items-center justify-end pr-1"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const day = week.find((d) => d.date.getDay() === dayIdx)
                if (!day) {
                  return <div key={dayIdx} className="h-[13px] w-[13px]" />
                }
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      'h-[13px] w-[13px] rounded-sm cursor-pointer transition-colors',
                      getColor(day.minutes)
                    )}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltip({
                        date: formatDate(day.date),
                        minutes: day.minutes,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-1 ml-8 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-[13px] w-[13px] rounded-sm bg-secondary" />
          <div className="h-[13px] w-[13px] rounded-sm bg-primary/20" />
          <div className="h-[13px] w-[13px] rounded-sm bg-primary/40" />
          <div className="h-[13px] w-[13px] rounded-sm bg-primary/70" />
          <div className="h-[13px] w-[13px] rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-md bg-popover text-popover-foreground text-xs border shadow-md pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 36,
            transform: 'translateX(-50%)',
          }}
        >
          <strong>{tooltip.minutes} min</strong> on {tooltip.date}
        </div>
      )}
    </div>
  )
}

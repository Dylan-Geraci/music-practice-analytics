'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Music } from 'lucide-react'

interface TopSongsChartProps {
  data: Array<{ title: string; minutes: number }>
}

export default function TopSongsChart({ data }: TopSongsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-600/10">
              <Music className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-base">Most Practiced Songs</CardTitle>
              <CardDescription>Your top songs by practice time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No song data yet. Link songs to your practice sessions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-600/10">
            <Music className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-base">Most Practiced Songs</CardTitle>
            <CardDescription>Your top songs by practice time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis
                dataKey="title"
                type="category"
                width={120}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tick={{ width: 110 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--popover-foreground)',
                }}
                formatter={(value) => [`${value} min`, 'Practice Time']}
                cursor={{ fill: 'var(--accent)', opacity: 0.3 }}
              />
              <Bar dataKey="minutes" fill="var(--chart-3)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

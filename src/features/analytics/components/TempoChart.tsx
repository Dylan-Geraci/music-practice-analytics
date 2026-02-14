'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TempoChartProps {
  data: Array<{ date: string; tempo: number; section: string }>
  targetTempo?: number | null
}

export default function TempoChart({ data, targetTempo }: TempoChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tempo Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No tempo data yet. Log sessions with BPM to track progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tempo Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value) => [`${value} BPM`, 'Tempo']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="tempo"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))' }}
              />
              {targetTempo && (
                <Line
                  type="monotone"
                  dataKey={() => targetTempo}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {targetTempo && (
          <p className="text-xs text-muted-foreground mt-2">
            Dashed line = target tempo ({targetTempo} BPM)
          </p>
        )}
      </CardContent>
    </Card>
  )
}

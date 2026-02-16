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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface AvgDurationChartProps {
  data: Array<{ month: string; avgMinutes: number }>
}

export default function AvgDurationChart({ data }: AvgDurationChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-600/10">
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-base">Avg Session Duration Trend</CardTitle>
            <CardDescription>How your session length changes over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--popover-foreground)',
                }}
                formatter={(value) => [`${value} min`, 'Avg Duration']}
              />
              <Line
                type="monotone"
                dataKey="avgMinutes"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-2)', r: 3 }}
                activeDot={{ r: 5, stroke: 'var(--chart-2)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

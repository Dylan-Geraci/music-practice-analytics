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

interface AvgDurationChartProps {
  data: Array<{ month: string; avgMinutes: number }>
}

export default function AvgDurationChart({ data }: AvgDurationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Avg Session Duration Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value) => [`${value} min`, 'Avg Duration']}
              />
              <Line
                type="monotone"
                dataKey="avgMinutes"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-5))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

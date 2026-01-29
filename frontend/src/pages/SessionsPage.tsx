import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sessions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Practice Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sessions coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}

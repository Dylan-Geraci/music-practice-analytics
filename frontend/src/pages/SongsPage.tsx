import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SongsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Songs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Songs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Songs coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}

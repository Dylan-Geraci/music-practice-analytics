import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Music Practice Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Frontend setup complete with shadcn/ui and TanStack Query.
          </p>
          <Button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

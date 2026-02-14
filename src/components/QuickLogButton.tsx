'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SessionForm from '@/features/sessions/components/SessionForm'

export default function QuickLogButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <SessionForm open={open} onOpenChange={setOpen} />
    </>
  )
}

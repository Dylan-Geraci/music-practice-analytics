'use client'

import Metronome from '@/features/tools/components/Metronome'
import PracticeTimer from '@/features/tools/components/PracticeTimer'

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Practice Tools</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PracticeTimer />
        <Metronome />
      </div>
    </div>
  )
}

'use client'

import GoalSettings from '@/features/goals/components/GoalSettings'
import ProfileSettings from '@/features/profile/components/ProfileSettings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <ProfileSettings />
        <GoalSettings />
      </div>
    </div>
  )
}

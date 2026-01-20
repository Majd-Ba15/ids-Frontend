"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [courseReminders, setCourseReminders] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiFetch<{ emailNotifications: boolean; courseReminders: boolean }>("/api/Users/settings")
      .then(d => {
        setEmailNotifications(d.emailNotifications)
        setCourseReminders(d.courseReminders)
      })
      .catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    try {
      await apiFetch("/api/Users/settings", {
        method: "PUT",
        body: JSON.stringify({
          emailNotifications,
          courseReminders,
        }),
      })
      alert("✅ Settings saved")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Email Notifications</span>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex justify-between items-center">
            <span>Course Reminders</span>
            <Switch checked={courseReminders} onCheckedChange={setCourseReminders} />
          </div>

          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

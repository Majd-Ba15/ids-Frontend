"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award } from "lucide-react"

type MyEnrollment = {
  courseId: number
  courseTitle: string
  category: string
  progressPercentage: number
}

const categoryImageMap: Record<string, string> = {
  Programming: "/web-development-concept.png",
  Backend: "/react-development-concept.png",
  "Data Science": "/python-data-science.png",
  Marketing: "/digital-marketing-strategy.png",
  Design: "/ui-ux-design-concept.png",
  "Machine Learning": "/machine-learning-concept.png",
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<MyEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<MyEnrollment[]>("/api/Enrollments/my")
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading dashboard...</p>

  const enrolledCount = courses.length
  const completedCount = courses.filter(c => c.progressPercentage >= 100).length
  const certificateCount = completedCount // for now

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
      </div>

      {/* ✅ Stats (you asked not to remove) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{enrolledCount}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{completedCount}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{certificateCount}</CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses.map(c => (
            <div key={c.courseId} className="flex gap-4 p-4 border rounded-lg">
              <img
                src={categoryImageMap[c.category] || "/placeholder.jpg"}
                alt={c.courseTitle}
                className="w-32 h-20 object-cover rounded"
              />

              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{c.courseTitle}</h3>
                <Progress value={c.progressPercentage} className="h-2" />
              </div>

              {/* ✅ Continue will NOT 404 after you rename folder to [id] */}
              <Button asChild>
                <Link href={`/dashboard/courses/${c.courseId}`}>Continue</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

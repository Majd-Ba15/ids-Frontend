"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

type EnrolledCourse = {
  courseId: number
  courseTitle: string
  progressPercentage: number
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])

  useEffect(() => {
    apiFetch<EnrolledCourse[]>("/api/enrollments/my")
      .then(setCourses)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">Enrolled: {courses.length}</div>
        <div className="border p-4 rounded">
          Completed: {courses.filter(c => c.progressPercentage === 100).length}
        </div>
        <div className="border p-4 rounded">Certificates: 0</div>
      </div>

      <div className="border rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Continue Learning</h2>

        {courses.map(course => (
          <div key={course.courseId} className="flex gap-4 border p-4 rounded">
            <div className="flex-1">
              <p className="font-semibold">{course.courseTitle}</p>
              <Progress value={course.progressPercentage} />
            </div>

            {course.progressPercentage === 100 ? (
              <Button asChild>
                <Link href={`/dashboard/courses/${course.courseId}/quiz`}>
                  Take Quiz
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/dashboard/courses/${course.courseId}`}>
                  Continue
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

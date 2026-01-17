"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Course = {
  id: number
  title: string
  category: string
  difficulty: string
  shortDescription: string
}

type Enrollment = {
  courseId: number
}

const categoryImageMap: Record<string, string> = {
  Programming: "/web-development-concept.png",
  Backend: "/react-development-concept.png",
  "Data Science": "/python-data-science.png",
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledIds, setEnrolledIds] = useState<number[]>([])

  useEffect(() => {
    apiFetch<Course[]>("/api/Courses").then(setCourses)

    apiFetch<Enrollment[]>("/api/Enrollments/my")
      .then(data => setEnrolledIds(data.map(e => e.courseId)))
      .catch(() => setEnrolledIds([]))
  }, [])

  async function enroll(courseId: number) {
    await apiFetch("/api/Enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    })
    router.push("/dashboard")
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map(course => {
        const isEnrolled = enrolledIds.includes(course.id)

        return (
          <Card key={course.id}>
            <img
              src={categoryImageMap[course.category] || "/placeholder.jpg"}
              className="h-48 w-full object-cover"
            />

            <CardHeader>
              <Badge>{course.category}</Badge>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-sm">{course.shortDescription}</p>
            </CardHeader>

            <CardContent className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/courses/${course.id}`}>View</Link>
              </Button>

              {!isEnrolled && (
                <Button onClick={() => enroll(course.id)}>Enroll</Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

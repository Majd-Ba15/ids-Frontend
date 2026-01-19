"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type Course = {
  id: number
  title: string
  description: string
}

type Enrollment = {
  courseId: number
  progressPercentage: number
}

export const courseImages: Record<string, string> = {
  "ASP.NET Core": "/web-development-course.png",
  "ASP.NET Core Updated": "/react-development-concept.png",
  "Python Programming": "/python-programming-concept.png",
  "Python for Data Science": "/python-data-science.png",
  "Web Development Fundamentals": "/web-development-concept.png",
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<Course[]>("/api/courses"),
      apiFetch<Enrollment[]>("/api/enrollments/my"),
    ])
      .then(([courses, enrollments]) => {
        setCourses(courses)
        setEnrollments(enrollments)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  const isEnrolled = (courseId: number) =>
    enrollments.find(e => e.courseId === courseId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => {
          const enrollment = isEnrolled(course.id)

          return (
            <div key={course.id} className="border rounded-lg overflow-hidden">
              <img
                src={courseImages[course.title] ?? "/placeholder.jpg"}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>

                {/* BUTTON LOGIC */}
                {enrollment ? (
                  enrollment.progressPercentage === 100 ? (
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/courses/${course.id}/quiz`}>
                        Take Quiz
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/courses/${course.id}`}>
                        Continue
                      </Link>
                    </Button>
                  )
                ) : (
               <Button
  className="w-full"
  onClick={async () => {
    try {
      await apiFetch("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({
          courseId: course.id,
        }),
      })

      location.reload()
    } catch (err) {
      console.error(err)
      alert("Enrollment failed")
    }
  }}
>
  Enroll
</Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

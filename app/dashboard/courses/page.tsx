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

// 🔹 map course title → public image
export const courseImages: Record<string, string> = {
  "ASP.NET Core": "/web-development-course.png",
  "ASP.NET Core Updated": "/react-development-concept.png",
  "Python Programming": "/python-programming-concept.png",
  "Python for Data Science": "/python-data-science.png",
  "Web Development Fundamentals": "/web-development-concept.png",
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Course[]>("/api/courses")
      .then(setCourses)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading courses...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="border rounded-lg overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={
                courseImages[course.title] ??
                "/courses/default.jpg"
              }
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold">
                {course.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>

              {/* 🔥 FIXED VIEW */}
              <Button asChild className="w-full">
                <Link
                  href={`/dashboard/courses/${course.id}`}
                >
                  View Course
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

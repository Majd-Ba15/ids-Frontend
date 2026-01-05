"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

type Course = {
  id: number
  title: string
  shortDescription: string
  category: string
  estimatedDuration: number
}

type Lesson = {
  id: number
  title: string
  lessonType: string
  estimatedDuration: number
}

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.id

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch course
        const courseRes = await fetch(`https://localhost:7026/api/Courses/${courseId}`)
        if (!courseRes.ok) throw new Error("Failed to load course")
        const courseData = await courseRes.json()
        setCourse(courseData)

        // 2️⃣ Fetch lessons
        const lessonsRes = await fetch(
          `https://localhost:7026/api/Lessons/course/${courseId}`
        )
        if (!lessonsRes.ok) throw new Error("Failed to load lessons")
        const lessonsData = await lessonsRes.json()

        // ✅ VERY IMPORTANT SAFETY CHECK
        setLessons(Array.isArray(lessonsData) ? lessonsData : [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!course) return <p className="p-6">Course not found</p>

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Courses
        </Button>

        <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        <p className="text-muted-foreground mt-2">
          {course.shortDescription}
        </p>

        <div className="flex gap-2 mt-3">
          <Badge>{course.category}</Badge>
          <Badge variant="outline">
            {course.estimatedDuration} min
          </Badge>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {lessons.length === 0 && (
              <p className="text-muted-foreground">No lessons available.</p>
            )}

            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {lesson.lessonType} • {lesson.estimatedDuration} min
                  </p>
                </div>

                <Button asChild>
                  <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                    Start
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

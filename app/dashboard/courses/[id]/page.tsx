"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type EnrolledCourse = {
  courseId: number
  courseTitle: string
  category: string
  progressPercentage: number
}

type Lesson = {
  id: number
  title: string
  order: number
  isCompleted: boolean
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<EnrolledCourse | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // 1) load course from enrollments
      const enrollments = await apiFetch<EnrolledCourse[]>("/api/Enrollments/my")
      const found = enrollments.find(e => e.courseId === Number(id))
      if (!found) {
        router.push("/dashboard")
        return
      }
      setCourse(found)

      // 2) load lessons
      const list = await apiFetch<Lesson[]>(`/api/Courses/${id}/lessons`)
      setLessons(list.sort((a, b) => a.order - b.order))
    }

    load()
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, router])

  const firstUncompletedOrder = useMemo(() => {
    const u = lessons.find(l => !l.isCompleted)
    return u ? u.order : 9999
  }, [lessons])

  if (loading) return <p>Loading...</p>
  if (!course) return null

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push("/dashboard")}>
        ← Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold">{course.courseTitle}</h1>

      <div className="space-y-3">
        {lessons.map(lesson => {
          const locked = lesson.order > firstUncompletedOrder

          return (
            <div
              key={lesson.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div>
                <div className="font-semibold">{lesson.title}</div>
                {lesson.isCompleted ? (
                  <div className="text-sm text-green-600">Completed</div>
                ) : locked ? (
                  <div className="text-sm text-red-500">Locked</div>
                ) : (
                  <div className="text-sm text-muted-foreground">Available</div>
                )}
              </div>

              <Button disabled={locked} asChild>
                <Link href={`/dashboard/courses/${id}/lessons/${lesson.id}`}>
                  {lesson.isCompleted ? "Review" : "Start"}
                </Link>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type Lesson = {
  id: number
  title: string
  orderIndex: number
}

export default function CoursePage() {
  const { id } = useParams()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completed, setCompleted] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const lessonsData = await apiFetch<Lesson[]>(
        `/api/lessons/course/${id}`
      )
      const completedData = await apiFetch<number[]>(
        `/api/lessons/completed`
      )

      setLessons(lessonsData.sort((a, b) => a.orderIndex - b.orderIndex))
      setCompleted(completedData)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p>Loading lessons...</p>

  return (
    <div className="space-y-6">
      <Link href="/dashboard">← Back to Dashboard</Link>

      <h1 className="text-2xl font-bold">Course Lessons</h1>

      {lessons.map((lesson, index) => {
        const unlocked =
          index === 0 || completed.includes(lessons[index - 1].id)

        return (
          <div
            key={lesson.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <span>{lesson.title}</span>

            {unlocked ? (
              <Button asChild>
                <Link
                  href={`/dashboard/courses/${id}/lessons/${lesson.id}`}
                >
                  Continue
                </Link>
              </Button>
            ) : (
              <Button disabled>Locked</Button>
            )}
          </div>
        )
      })}
    </div>
  )
}

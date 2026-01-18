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

  useEffect(() => {
    ;(async () => {
      const l = await apiFetch<Lesson[]>(`/api/lessons/course/${id}`)
      const c = await apiFetch<number[]>(`/api/lessons/completed`)
      setLessons(l.sort((a, b) => a.orderIndex - b.orderIndex))
      setCompleted(c)
    })()
  }, [id])

  return (
    <div className="space-y-6">
      <Link href="/dashboard">← Back</Link>

      <h1 className="text-2xl font-bold">Course Lessons</h1>

      {lessons.map((lesson, i) => {
        const unlocked =
          i === 0 || completed.includes(lessons[i - 1].id)

        return (
          <div
            key={lesson.id}
            className="border p-4 rounded flex justify-between"
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

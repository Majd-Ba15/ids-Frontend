"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type Lesson = {
  id: number
  title: string
  videoUrl: string
  order: number
  isCompleted: boolean
}

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Lesson[]>(`/api/Courses/${id}/lessons`)
      .then(data => setLessons(data.sort((a, b) => a.order - b.order)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const current = useMemo(
    () => lessons.find(l => l.id === Number(lessonId)),
    [lessons, lessonId]
  )

  const prev = useMemo(() => {
    if (!current) return null
    return lessons.find(l => l.order === current.order - 1) || null
  }, [lessons, current])

  const next = useMemo(() => {
    if (!current) return null
    return lessons.find(l => l.order === current.order + 1) || null
  }, [lessons, current])

  async function markComplete() {
    await apiFetch(`/api/Lessons/${lessonId}/complete`, { method: "POST" })

    // reload lessons to update isCompleted + unlock next
    const updated = await apiFetch<Lesson[]>(`/api/Courses/${id}/lessons`)
    const sorted = updated.sort((a, b) => a.order - b.order)
    setLessons(sorted)

    if (next) {
      router.push(`/dashboard/courses/${id}/lessons/${next.id}`)
    } else {
      router.push(`/dashboard/courses/${id}`)
    }
  }

  if (loading) return <p>Loading lesson...</p>
  if (!current) return <p>No lesson found.</p>

  return (
    <div className="space-y-6">
      {/* BACK */}
      <Button variant="outline" onClick={() => router.push(`/dashboard/courses/${id}`)}>
        ← Back to Course
      </Button>

      <h1 className="text-2xl font-bold">{current.title}</h1>

      <video controls className="w-full rounded">
        <source src={current.videoUrl} />
      </video>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={!prev}
          onClick={() => prev && router.push(`/dashboard/courses/${id}/lessons/${prev.id}`)}
        >
          Previous
        </Button>

        <Button onClick={markComplete}>
          {next ? "Complete & Next" : "Complete Course"}
        </Button>

        <Button
          variant="outline"
          disabled={!next}
          onClick={() => next && router.push(`/dashboard/courses/${id}/lessons/${next.id}`)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

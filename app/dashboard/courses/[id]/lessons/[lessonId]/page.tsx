"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

type Lesson = {
  id: number
  title: string
  videoUrl: string | null
  orderIndex: number
}

export default function LessonPage() {
  const { id, lessonId } = useParams()
  const router = useRouter()

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<Lesson[]>(`/api/lessons/course/${id}`)
      .then(data => {
        setLessons(data.sort((a, b) => a.orderIndex - b.orderIndex))
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Loading...</p>

  const index = lessons.findIndex(l => l.id === Number(lessonId))
  if (index === -1) return <p>Lesson not found</p>

  const lesson = lessons[index]

  async function completeLesson() {
    const token = localStorage.getItem("token")
    if (!token) return alert("Not logged in")

    await fetch(
      `https://localhost:7026/api/lessons/${lesson.id}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const next = lessons[index + 1]
    if (next) {
      router.push(`/dashboard/courses/${id}/lessons/${next.id}`)
      
    } else {
      router.push(`/dashboard/courses/${id}`)
    }
  }

  return (
    <div className="space-y-6">
      <Link href={`/dashboard/courses/${id}`}>← Back to Course</Link>

      <h1 className="text-xl font-bold">{lesson.title}</h1>

      {/* VIDEO (MEDIUM SIZE) */}
      {/* VIDEO */}
{lesson?.videoUrl && (
  <div className="flex justify-center">
    <div className="w-full max-w-2xl aspect-video">
      <iframe
        src={lesson.videoUrl}
        className="w-full h-full rounded-md border"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  </div>
)}

      <div className="flex justify-between">
        <Button
          disabled={index === 0}
          onClick={() =>
            router.push(
              `/dashboard/courses/${id}/lessons/${lessons[index - 1].id}`
            )
          }
        >
          Prev
        </Button>

        <Button onClick={completeLesson}>
          Mark as Completed
        </Button>
      </div>
    </div>
  )
}

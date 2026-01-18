"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

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
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>

  const index = lessons.findIndex(l => l.id === Number(lessonId))
  if (index === -1) return <p>Lesson not found</p>

  const lesson = lessons[index]

  // ✅ COMPLETE LESSON (NO JSON)
  async function completeLesson() {
  const token = localStorage.getItem("token")
  if (!token) return

  const res = await fetch(
    `http://localhost:7026/api/lessons/${lesson.id}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) return

  const next = lessons[index + 1]
  router.push(
    next
      ? `/dashboard/courses/${id}/lessons/${next.id}`
      : `/dashboard/courses/${id}`
  )
}

  return (
    <div className="space-y-6">
      <Link href={`/dashboard/courses/${id}`}>
        ← Back to Course
      </Link>

      <h1 className="text-xl font-bold">{lesson.title}</h1>

      {/* ✅ VIDEO HANDLING */}
      {lesson.videoUrl ? (
        lesson.videoUrl.includes("youtube") ||
        lesson.videoUrl.includes("youtu.be") ? (
          <iframe
            src={lesson.videoUrl.replace("watch?v=", "embed/")}
            className="w-full aspect-video rounded"
            allowFullScreen
          />
        ) : (
   <div className="max-w-md mx-auto">
  <video
    controls
    className="w-full aspect-video rounded-md bg-black"
  >
    <source
      src={
        lesson.videoUrl!.startsWith("http")
          ? lesson.videoUrl!
          : `http://localhost:7026${lesson.videoUrl}`
      }
      type="video/mp4"
    />
  </video>
</div>
        )
      ) : (
        <p className="text-gray-500">No video available</p>
      )}

      {/* NAV */}
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

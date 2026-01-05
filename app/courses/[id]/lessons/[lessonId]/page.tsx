"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

type Lesson = {
  id: number
  title: string
  content: string
  videoUrl: string | null
  attachmentUrl: string | null
  lessonType: string
}

export default function LessonViewerPage() {
  const params = useParams()
  const router = useRouter()

  const courseId = params?.id
  const lessonId = params?.lessonId

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lessonId) return

    const fetchLesson = async () => {
      try {
        const res = await fetch(
          `https://localhost:7026/api/Lessons/${lessonId}`
        )

        if (!res.ok) {
          throw new Error("Failed to load lesson")
        }

        const data = await res.json()
        setLesson(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId])

  if (loading) return <p className="p-6">Loading lesson...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!lesson) return <p className="p-6">Lesson not found</p>

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* VIDEO */}
            {lesson.videoUrl && (
              <div className="aspect-video">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full rounded"
                  allowFullScreen
                />
              </div>
            )}

            {/* CONTENT */}
            <div className="whitespace-pre-line text-sm">
              {lesson.content}
            </div>

            
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

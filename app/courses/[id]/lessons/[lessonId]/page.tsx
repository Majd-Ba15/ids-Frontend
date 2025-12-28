"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LessonViewerPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const [completed, setCompleted] = useState(false)

  const lesson = {
    id: params.lessonId,
    title: "CSS Layouts with Flexbox",
    courseId: params.id,
    courseName: "Web Development Fundamentals",
    videoUrl: "https://example.com/video.mp4",
    content: `
      In this lesson, you'll learn about CSS Flexbox, a powerful layout system that makes it easy to design flexible responsive layout structures.
      
      Flexbox provides:
      • Simple alignment of items
      • Equal spacing between elements
      • Flexible sizing and wrapping
      • Responsive design capabilities
      
      We'll cover the main properties like display: flex, justify-content, align-items, and flex-direction.
    `,
    previousLesson: Number.parseInt(params.lessonId) > 1 ? (Number.parseInt(params.lessonId) - 1).toString() : null,
    nextLesson: (Number.parseInt(params.lessonId) + 1).toString(),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link href="/dashboard/courses" className="hover:text-primary">
              My Courses
            </Link>
            {" / "}
            <Link href={`/courses/${lesson.courseId}`} className="hover:text-primary">
              {lesson.courseName}
            </Link>
            {" / "}
            <span className="text-foreground">{lesson.title}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video Player Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Video Player</p>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line">{lesson.content}</div>
                  </div>

                  {/* Navigation & Mark Complete */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div>
                      {lesson.previousLesson && (
                        <Button variant="outline" asChild>
                          <Link href={`/courses/${lesson.courseId}/lessons/${lesson.previousLesson}`}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous Lesson
                          </Link>
                        </Button>
                      )}
                    </div>
                    <Button onClick={() => setCompleted(!completed)} variant={completed ? "outline" : "default"}>
                      {completed ? "Completed ✓" : "Mark as Completed"}
                    </Button>
                    <div>
                      {lesson.nextLesson && (
                        <Button asChild>
                          <Link href={`/courses/${lesson.courseId}/lessons/${lesson.nextLesson}`}>
                            Next Lesson
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Lesson List */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-primary/10 rounded-lg font-medium">
                      Lesson {lesson.id}: {lesson.title}
                    </div>
                    <p className="text-muted-foreground pt-2">Use the navigation buttons to move between lessons</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Import missing component
import { PlayCircle } from "lucide-react"

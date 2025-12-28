import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = {
    id: params.id,
    title: "Web Development Fundamentals",
    description:
      "Learn the foundations of modern web development including HTML, CSS, JavaScript, and popular frameworks. This comprehensive course will take you from beginner to proficient web developer.",
    category: "Development",
    difficulty: "Beginner",
    thumbnail: "/web-development-course.png",
    progress: 35,
    enrolled: true,
    totalLessons: 24,
    completedLessons: 8,
  }

  const lessons = [
    { id: 1, title: "Introduction to Web Development", duration: "12:30", completed: true, locked: false },
    { id: 2, title: "HTML Basics", duration: "18:45", completed: true, locked: false },
    { id: 3, title: "CSS Fundamentals", duration: "22:15", completed: true, locked: false },
    { id: 4, title: "CSS Layouts with Flexbox", duration: "25:30", completed: false, locked: false },
    { id: 5, title: "CSS Grid System", duration: "20:00", completed: false, locked: false },
    { id: 6, title: "JavaScript Basics", duration: "30:00", completed: false, locked: true },
    { id: 7, title: "DOM Manipulation", duration: "28:15", completed: false, locked: true },
    { id: 8, title: "ES6+ Features", duration: "35:00", completed: false, locked: true },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-12 px-4">
          <div className="container mx-auto">
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.difficulty}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{course.description}</p>

            {course.enrolled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Your Progress: {course.completedLessons} of {course.totalLessons} lessons
                  </span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-3 max-w-md" />
                <Button size="lg" asChild>
                  <Link href={`/courses/${course.id}/lessons/4`}>Continue Learning</Link>
                </Button>
              </div>
            ) : (
              <Button size="lg">Enroll Now</Button>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Lessons</CardTitle>
              <CardDescription>Complete lessons in order to unlock the next ones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      lesson.locked ? "opacity-60" : "hover:bg-accent cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : lesson.locked ? (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <PlayCircle className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                    {!lesson.locked && (
                      <Button variant={lesson.completed ? "outline" : "default"} asChild>
                        <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                          {lesson.completed ? "Review" : "Start"}
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

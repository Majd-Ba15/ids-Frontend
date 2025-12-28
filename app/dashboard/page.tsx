import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      progress: 65,
      lastLesson: "Introduction to React",
      thumbnail: "/web-development-concept.png",
    },
    {
      id: 2,
      title: "Python for Data Science",
      progress: 40,
      lastLesson: "Pandas DataFrames",
      thumbnail: "/python-programming-concept.png",
    },
    {
      id: 3,
      title: "Digital Marketing Basics",
      progress: 85,
      lastLesson: "SEO Best Practices",
      thumbnail: "/digital-marketing-strategy.png",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active learning paths</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Earned so far</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">Last lesson: {course.lastLesson}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
              <div className="flex items-center">
                <Button asChild>
                  <Link href={`/dashboard/courses/${course.id}/lessons`}>Continue</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

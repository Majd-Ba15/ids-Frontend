import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function MyCoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      progress: 65,
      category: "Development",
      thumbnail: "/web-development-concept.png",
      totalLessons: 24,
      completedLessons: 16,
    },
    {
      id: 2,
      title: "Python for Data Science",
      progress: 40,
      category: "Data Science",
      thumbnail: "/python-programming-concept.png",
      totalLessons: 30,
      completedLessons: 12,
    },
    {
      id: 3,
      title: "Digital Marketing Basics",
      progress: 85,
      category: "Marketing",
      thumbnail: "/digital-marketing-strategy.png",
      totalLessons: 20,
      completedLessons: 17,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">Continue learning from where you left off</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">
                {course.category}
              </Badge>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription>
                {course.completedLessons} of {course.totalLessons} lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>Continue Learning</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

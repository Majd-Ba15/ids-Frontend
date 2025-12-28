"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

export default function CoursesPage() {
  const [category, setCategory] = useState("all")
  const [difficulty, setDifficulty] = useState("all")

  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      category: "Development",
      difficulty: "Beginner",
      students: 1250,
      thumbnail: "/web-development-concept.png",
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      category: "Development",
      difficulty: "Advanced",
      students: 890,
      thumbnail: "/react-development-concept.png",
    },
    {
      id: 3,
      title: "Python for Data Science",
      category: "Data Science",
      difficulty: "Intermediate",
      students: 2100,
      thumbnail: "/python-data-science.png",
    },
    {
      id: 4,
      title: "Digital Marketing Basics",
      category: "Marketing",
      difficulty: "Beginner",
      students: 1680,
      thumbnail: "/digital-marketing-strategy.png",
    },
    {
      id: 5,
      title: "UI/UX Design Principles",
      category: "Design",
      difficulty: "Beginner",
      students: 1420,
      thumbnail: "/ui-ux-design-concept.png",
    },
    {
      id: 6,
      title: "Machine Learning Fundamentals",
      category: "Data Science",
      difficulty: "Advanced",
      students: 980,
      thumbnail: "/machine-learning-concept.png",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse Courses</h1>
            <p className="text-muted-foreground">Explore our comprehensive course catalog</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription>{course.students.toLocaleString()} students enrolled</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

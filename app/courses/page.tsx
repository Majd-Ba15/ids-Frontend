"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input" // ✅ add input

type Course = {
  id: number
  title: string
  category: string
  difficulty: string
  shortDescription: string
  thumbnail: string | null
}

const categoryImageMap: Record<string, string> = {
  Programming: "/web-development-concept.png",
  Backend: "/react-development-concept.png",
  "Data Science": "/python-data-science.png",
  Marketing: "/digital-marketing-strategy.png",
  Design: "/ui-ux-design-concept.png",
  "Machine Learning": "/machine-learning-concept.png",
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("") // ✅ search state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://localhost:7026/api/Courses")

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`)
        }

        const data = await res.json()
        setCourses(data)
      } catch (err) {
        console.error(err)
        setError("Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // ✅ FILTER LOGIC
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.category.toLowerCase().includes(search.toLowerCase()) ||
    course.difficulty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Browse Courses</h1>

          {/* ✅ SEARCH INPUT */}
          <div className="mb-8">
            <Input
              placeholder="Search by title, category, or difficulty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading && <p>Loading courses...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length === 0 && (
                <p className="text-muted-foreground col-span-full">
                  No courses found.
                </p>
              )}

              {filteredCourses.map(course => (
                <Card key={course.id} className="overflow-hidden">
                  <img
                    src={
                      categoryImageMap[course.category] ||
                      "/placeholder.jpg"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />

                  <CardHeader>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>

                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.shortDescription}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>
                        View Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"

type Course = {
  id: number
  title: string
  category: string
  difficulty: string
  shortDescription: string
  thumbnail: string | null
}

type MyEnrollment = {
  courseId: number
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
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [enrolledIds, setEnrolledIds] = useState<number[]>([])
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const [tokenExists, setTokenExists] = useState(false)

  // ✅ detect token safely
  useEffect(() => {
    setTokenExists(!!localStorage.getItem("token"))
  }, [])

  async function loadCourses() {
    const data = await apiFetch<Course[]>("/api/courses")
    setCourses(data)
  }

  async function loadMyEnrollments() {
    if (!tokenExists) {
      setEnrolledIds([])
      return
    }

    const enrolls = await apiFetch<MyEnrollment[]>("/api/enrollments/my")
    setEnrolledIds(enrolls.map(e => e.courseId))
  }

  useEffect(() => {
    ;(async () => {
      try {
        await loadCourses()
        await loadMyEnrollments()
      } finally {
        setLoading(false)
      }
    })()
  }, [tokenExists])

  const filteredCourses = useMemo(() => {
    return courses.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.difficulty.toLowerCase().includes(search.toLowerCase())
    )
  }, [courses, search])

  async function handleEnroll(courseId: number) {
    if (!tokenExists) {
      router.push("/login")
      return
    }

    try {
      setEnrollingId(courseId)

      await apiFetch("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      })

      await loadMyEnrollments()
      router.push("/dashboard")

    } catch (e: any) {
      // ✅ IMPORTANT: already enrolled is NOT an error
      if (e.message?.includes("Already enrolled")) {
        await loadMyEnrollments()
        return
      }

      alert("Enroll failed")
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6">Browse Courses</h1>

          <Input
            placeholder="Search by title, category, or difficulty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md mb-8"
          />

          {loading && <p>Loading courses...</p>}

          {!loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map(course => {
                const isEnrolled = enrolledIds.includes(course.id)

                return (
                  <Card key={course.id} className="overflow-hidden">
                    <img
                      src={
                        categoryImageMap[course.category] ||
                        course.thumbnail ||
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
                      <CardDescription>{course.shortDescription}</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex flex-col gap-2">
                      <Button asChild className="w-full">
                        <Link href={`/courses/${course.id}`}>View Course</Link>
                      </Button>

                      <Button
                        className="w-full"
                        variant={isEnrolled ? "outline" : "default"}
                        disabled={isEnrolled || enrollingId === course.id}
                        onClick={() => handleEnroll(course.id)}
                      >
                        {isEnrolled
                          ? "Enrolled"
                          : enrollingId === course.id
                          ? "Enrolling..."
                          : "Enroll"}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

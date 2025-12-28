import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Video } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Learn New Skills Online</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Access thousands of courses, earn certificates, and advance your career with our comprehensive learning
            platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose eLEARNING?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Expert Content</CardTitle>
                <CardDescription>Learn from industry professionals with years of experience</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Video className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Video Lessons</CardTitle>
                <CardDescription>High-quality video content with interactive exercises</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Earn recognized certificates upon course completion</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>Join a vibrant community of learners worldwide</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students already learning on our platform</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

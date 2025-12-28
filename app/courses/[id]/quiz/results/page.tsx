import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Award } from "lucide-react"
import Link from "next/link"

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  const results = {
    totalQuestions: 3,
    correctAnswers: 2,
    wrongAnswers: 1,
    score: 67,
    passed: true,
    passingScore: 60,
    canRetake: true,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Results Header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {results.passed ? (
                  <Award className="h-20 w-20 text-green-600" />
                ) : (
                  <XCircle className="h-20 w-20 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl">{results.passed ? "Congratulations! 🎉" : "Keep Learning!"}</CardTitle>
              <CardDescription className="text-lg">
                {results.passed
                  ? "You've successfully passed this quiz!"
                  : "You didn't pass this time, but you can try again."}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Score Breakdown */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-primary mb-2">{results.score}%</div>
                <p className="text-muted-foreground">Passing score: {results.passingScore}%</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-lg">{results.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">Correct Answers</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-lg">{results.wrongAnswers}</div>
                    <div className="text-sm text-muted-foreground">Wrong Answers</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href={`/courses/${params.id}`}>Back to Course</Link>
                </Button>
                {results.canRetake && (
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href={`/courses/${params.id}/quiz`}>Retake Quiz</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

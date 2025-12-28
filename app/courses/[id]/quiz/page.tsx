"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds

  const quiz = {
    title: "Web Development Fundamentals - Module 1 Quiz",
    courseId: params.id,
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which CSS property is used to change the text color?",
        options: ["color", "text-color", "font-color", "text-style"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "What is the correct HTML tag for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctAnswer: 2,
      },
    ],
  }

  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    router.push(`/courses/${params.id}/quiz/results`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Quiz Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{quiz.title}</CardTitle>
                <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <CardDescription>
                Question {currentQuestion + 1} of {totalQuestions}
              </CardDescription>
              <Progress value={progress} className="mt-2" />
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{quiz.questions[currentQuestion].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString()}
                onValueChange={(value) => {
                  setSelectedAnswers({
                    ...selectedAnswers,
                    [currentQuestion]: value,
                  })
                }}
              >
                <div className="space-y-3">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                  Previous
                </Button>

                {currentQuestion === totalQuestions - 1 ? (
                  <Button onClick={handleSubmit}>Submit Quiz</Button>
                ) : (
                  <Button onClick={handleNext}>Next Question</Button>
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

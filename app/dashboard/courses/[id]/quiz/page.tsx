"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type QuizDto = {
  id: number
  title: string
  passingScore: number
  timeLimit: number | null
  questions: {
    id: number
    questionText: string
    answers: { id: number; answerText: string }[]
  }[]
}

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Not logged in")

  const res = await fetch(`http://localhost:7026${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  const txt = await res.text()
  return (txt ? JSON.parse(txt) : null) as T
}

export default function CourseQuizPage() {
  const { id } = useParams()
  const courseId = Number(id)
  const router = useRouter()

  const [quiz, setQuiz] = useState<QuizDto | null>(null)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [result, setResult] = useState<{ score: number; pass: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  const total = quiz?.questions.length ?? 0

  useEffect(() => {
    ;(async () => {
      try {
        const q = await authFetch<QuizDto>(`/api/quizzes/course/${courseId}`)
        setQuiz(q)
        if (q.timeLimit) setSecondsLeft(q.timeLimit * 60)

        // create attempt
        const newAttemptId = await authFetch<number>(`/api/quizattempts`, {
          method: "POST",
          body: JSON.stringify({ quizId: q.id }),
        })
        setAttemptId(newAttemptId)
      } catch (e: any) {
        alert(String(e.message || "Quiz not available yet for this course."))
        router.push(`/dashboard/courses/${courseId}`)
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId, router])

  useEffect(() => {
    if (secondsLeft == null) return
    if (secondsLeft <= 0) {
      submit()
      return
    }
    const t = setInterval(() => setSecondsLeft((s) => (s == null ? s : s - 1)), 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  const answeredCount = useMemo(() => Object.keys(selected).length, [selected])

  async function submit() {
    if (!quiz || !attemptId || result) return

    // save responses
    for (const q of quiz.questions) {
      const ansId = selected[q.id]
      if (!ansId) continue
      await authFetch(`/api/quizresponses`, {
        method: "POST",
        body: JSON.stringify({
          attemptId,
          questionId: q.id,
          selectedAnswerId: ansId,
          textAnswer: null,
        }),
      })
    }

    // finalize attempt + get score
    const res = await authFetch<{ score: number; earnedPoints: number; totalPoints: number }>(
      `/api/quizattempts/${attemptId}/submit`,
      { method: "PUT" }
    )

    const pass = res.score >= quiz.passingScore
    setResult({ score: res.score, pass })
  }

  if (loading) return <p>Loading quiz...</p>
  if (!quiz) return null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Answered: {answeredCount}/{total} • Passing: {quiz.passingScore}%
          </p>
        </div>

        {secondsLeft != null && (
          <div className="rounded border px-3 py-2 text-sm">
            Time left: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
          </div>
        )}
      </div>

      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="border rounded-lg p-4 bg-white space-y-3">
          <p className="font-semibold">
            {idx + 1}. {q.questionText}
          </p>

          <div className="grid gap-2">
            {q.answers.map((a) => (
              <label
                key={a.id}
                className={`flex items-center gap-2 border rounded p-2 cursor-pointer ${
                  selected[q.id] === a.id ? "border-primary" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={selected[q.id] === a.id}
                  onChange={() => setSelected((s) => ({ ...s, [q.id]: a.id }))}
                />
                <span>{a.answerText}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {!result ? (
        <Button onClick={submit} className="w-full">
          Submit Quiz
        </Button>
      ) : (
        <div className="border rounded-lg p-4 bg-white space-y-3">
          <p className="text-lg font-bold">
            Score: {result.score.toFixed(1)}% — {result.pass ? "PASS ✅" : "FAIL ❌"}
          </p>

          {result.pass ? (
            <Button className="w-full" asChild>
              <a href="/dashboard/certificates">Go to Certificates</a>
            </Button>
          ) : (
            <Button className="w-full" onClick={() => window.location.reload()}>
              Retry Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

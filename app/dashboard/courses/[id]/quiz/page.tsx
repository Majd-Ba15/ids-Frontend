"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type Quiz = {
  id: number
  courseId: number
  title: string
  passingScore: number
  timeLimit?: number | null
  description?: string | null
  questions: {
    id: number
    questionText: string
    answers: { id: number; answerText: string }[]
  }[]
}

type Attempt = {
  id: number
  score: number
  earnedPoints: number
  totalPoints: number
  startedAt: string
  submittedAt: string | null
  timeTaken: number | null
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null
}

// ✅ IMPORTANT: for endpoints that return Ok() with NO JSON (QuizResponses)
async function fetchNoJson(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`https://localhost:7026${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  // do NOT parse json
  return
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = Number(params.id)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [history, setHistory] = useState<Attempt[]>([])
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ✅ Always 2 minutes
  const TIME_LIMIT_SECONDS = 2 * 60
  const [secondsLeft, setSecondsLeft] = useState<number>(TIME_LIMIT_SECONDS)

  const [lastResult, setLastResult] = useState<null | {
    score: number
    passed: boolean
    earnedPoints: number
    totalPoints: number
  }>(null)

  const locked = remaining === 0
  const autoSubmittingRef = useRef(false)

  async function refreshMeta(qid: number) {
    const rem = await apiFetch<{ remaining: number }>(`/api/QuizAttempts/remaining/${qid}`)
    setRemaining(rem.remaining)

    const hist = await apiFetch<Attempt[]>(`/api/QuizAttempts/my/${qid}`)
    setHistory(hist)
  }

  // Load quiz + meta (NO start here)
  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) return

    ;(async () => {
      try {
        setLoading(true)
        const q = await apiFetch<Quiz>(`/api/Quizzes/course/${courseId}`)
        setQuiz(q)
        setSecondsLeft(TIME_LIMIT_SECONDS)
        setAttemptId(null)
        setAnswers({})
        setLastResult(null)
        await refreshMeta(q.id)
      } catch (e: any) {
        alert(e.message || "Quiz not ready yet.")
        router.push("/dashboard/courses")
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId, router])

  // Timer runs only after start
  useEffect(() => {
    if (!attemptId) return
    if (secondsLeft <= 0) return

    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [attemptId, secondsLeft])

  // Auto submit once
  useEffect(() => {
    if (!attemptId) return
    if (secondsLeft !== 0) return
    if (autoSubmittingRef.current) return
    autoSubmittingRef.current = true
    submit(true).finally(() => {
      autoSubmittingRef.current = false
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, attemptId])

  async function start() {
    if (!quiz) return
    if (locked) return
    if (lastResult?.passed) return // ✅ already passed, no more starts

    setStarting(true)
    try {
      const startRes = await apiFetch<{ attemptId: number }>(`/api/QuizAttempts/start/${quiz.id}`, {
        method: "POST",
      })
      setAttemptId(startRes.attemptId)
      setSecondsLeft(TIME_LIMIT_SECONDS)
      setAnswers({})
      setLastResult(null)
    } catch (e: any) {
      alert(e.message || "Could not start attempt")
    } finally {
      setStarting(false)
    }
  }

  async function submit(isAuto = false) {
    if (!quiz || !attemptId) return
    setSubmitting(true)

    try {
      // ✅ 1) Save responses in parallel (fast and reliable)
      const payloads = quiz.questions.map(q => ({
        attemptId,
        questionId: q.id,
        selectedAnswerId: answers[q.id] ?? null,
      }))

      await Promise.all(
        payloads.map(p =>
          fetchNoJson("/api/QuizResponses", {
            method: "POST",
            body: JSON.stringify(p),
          })
        )
      )

      // ✅ 2) Submit attempt (this returns JSON)
      const result = await apiFetch<{
        score: number
        earnedPoints: number
        totalPoints: number
        passed: boolean
      }>(`/api/QuizAttempts/${attemptId}/submit`, {
        method: "PUT",
        body: JSON.stringify({
          timeTaken: TIME_LIMIT_SECONDS - secondsLeft,
        }),
      })

      setLastResult({
        score: result.score,
        passed: result.passed,
        earnedPoints: result.earnedPoints,
        totalPoints: result.totalPoints,
      })

      // ✅ Reset radio buttons after submit
      setAttemptId(null)
      setAnswers({})
      setSecondsLeft(TIME_LIMIT_SECONDS)

      // ✅ Refresh meta/history
      await refreshMeta(quiz.id)

      // ✅ Pass -> create certificate -> go certificates
      if (result.passed) {
        await apiFetch(`/api/Certificates?courseId=${courseId}`, { method: "POST" })
        alert(`✅ Passed! Score: ${result.score}%`)
        router.push("/dashboard/certificates")
        return
      }

      // Fail -> allow retake if remaining > 0
      if (!isAuto) window.scrollTo({ top: 0, behavior: "smooth" })
      alert(`❌ Failed. Score: ${result.score}%`)
    } catch (e: any) {
      alert(e.message || "Submit failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading quiz...</p>
  if (!quiz) return <p>No quiz available.</p>

  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, "0")

  const passedAlready = lastResult?.passed === true

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        {quiz.description ? <p className="text-muted-foreground">{quiz.description}</p> : null}

        <div className="flex flex-wrap gap-6 text-sm">
          <span>⏱ Time: <b>{mm}:{ss}</b></span>
          <span>🎯 Passing: <b>{quiz.passingScore}%</b></span>
          <span>🎟 Remaining attempts: <b>{remaining ?? "…"}</b></span>
        </div>
      </div>

      {/* Result box */}
      {lastResult ? (
        <div className={`border rounded p-4 ${lastResult.passed ? "border-green-500" : "border-red-500"}`}>
          <p className="font-semibold">
            {lastResult.passed ? "✅ Passed" : "❌ Failed"} — Score: {lastResult.score}%
          </p>
          <p className="text-sm text-muted-foreground">
            Correct: {lastResult.earnedPoints} / {lastResult.totalPoints}
          </p>

          {lastResult.passed ? (
            <Button className="mt-3" onClick={() => router.push("/dashboard/certificates")}>
              Go to Certificates
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* History */}
      <div className="border rounded p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Attempt History</h2>
          <Button variant="outline" onClick={() => refreshMeta(quiz.id)}>
            Refresh
          </Button>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">No attempts yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {history.map(a => (
              <li key={a.id}>
                #{a.id} — {a.score ?? 0}% — {a.submittedAt ? "Submitted ✅" : "Started ⏳"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Locked / Passed messages */}
      {passedAlready ? (
        <p className="text-green-600 font-semibold">You already passed this quiz ✅</p>
      ) : locked ? (
        <p className="text-red-600 font-semibold">Quiz locked — no attempts remaining</p>
      ) : null}

      {/* Start */}
      {!attemptId && !locked && !passedAlready ? (
        <div className="border rounded p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Press Start to begin. Attempts are counted when you <b>submit</b>.
          </p>
          <Button disabled={starting} onClick={start}>
            {starting ? "Starting..." : "Start Quiz"}
          </Button>
        </div>
      ) : null}

      {/* Questions */}
      {attemptId ? (
        <>
          {quiz.questions.map((q, index) => (
            <div key={q.id} className="border p-4 rounded space-y-2">
              <p className="font-semibold">
                {index + 1}. {q.questionText}
              </p>

              {q.answers.map(a => (
                <label key={a.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    checked={answers[q.id] === a.id}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: a.id }))}
                  />
                  {a.answerText}
                </label>
              ))}
            </div>
          ))}

          <Button disabled={submitting} onClick={() => submit(false)}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </>
      ) : null}
    </div>
  )
}

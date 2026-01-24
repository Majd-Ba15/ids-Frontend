"use client"

import { useEffect, useRef, useState } from "react"
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

// ✅ for endpoints that return Ok() with no JSON OR we don't care about JSON
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
  return
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = Number(params.id)

  const TIME_LIMIT_SECONDS = 2 * 60

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [history, setHistory] = useState<Attempt[]>([])
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>(TIME_LIMIT_SECONDS)

  const [lastResult, setLastResult] = useState<null | {
    score: number
    passed: boolean
    earnedPoints: number
    totalPoints: number
  }>(null)

  const locked = remaining === 0
  const passedAlready = lastResult?.passed === true

  // 🔒 locks
  const submitLockRef = useRef(false)
  const autoSubmitDisabledRef = useRef(false)

  // ⏱ timer ref
  const timerRef = useRef<number | null>(null)

  function getActiveAttempt(attempts: Attempt[]) {
    return attempts.find(a => a.submittedAt === null) ?? null
  }

  async function refreshMeta(qid: number) {
    const rem = await apiFetch<{ remaining: number }>(`/api/QuizAttempts/remaining/${qid}`)
    setRemaining(rem.remaining)

    const hist = await apiFetch<Attempt[]>(`/api/QuizAttempts/my/${qid}`)
    setHistory(hist)

    const active = getActiveAttempt(hist)
    if (active) {
      setAttemptId(active.id)
      setSecondsLeft(TIME_LIMIT_SECONDS)
      setAnswers({})
    }
  }

  // INITIAL LOAD
  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) return

    ;(async () => {
      try {
        setLoading(true)
        const q = await apiFetch<Quiz>(`/api/Quizzes/course/${courseId}`)
        setQuiz(q)

        // reset UI
        setAttemptId(null)
        setAnswers({})
        setSecondsLeft(TIME_LIMIT_SECONDS)
        setLastResult(null)

        // reset locks
        submitLockRef.current = false
        autoSubmitDisabledRef.current = false

        await refreshMeta(q.id)
      } catch (e: any) {
        alert(e.message || "Quiz not ready yet.")
        router.push("/dashboard/courses")
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId, router])

  // START/STOP TIMER WHEN attemptId CHANGES
  useEffect(() => {
    // stop previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!attemptId) return

    timerRef.current = window.setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0))
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [attemptId])

  // AUTO SUBMIT at 0 (ONLY ONCE)
  useEffect(() => {
    if (!attemptId) return
    if (secondsLeft !== 0) return
    if (autoSubmitDisabledRef.current) return
    if (submitLockRef.current) return

    submit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, attemptId])

  async function start() {
    if (!quiz) return
    if (locked) return
    if (passedAlready) return
    if (attemptId) return

    setStarting(true)
    try {
      const res = await apiFetch<{ attemptId: number }>(`/api/QuizAttempts/start/${quiz.id}`, {
        method: "POST",
      })

      setAttemptId(res.attemptId)
      setSecondsLeft(TIME_LIMIT_SECONDS)
      setAnswers({})
      setLastResult(null)

      autoSubmitDisabledRef.current = false
      submitLockRef.current = false
    } catch (e: any) {
      alert(e.message || "Could not start attempt")
    } finally {
      setStarting(false)
    }
  }

  // Save response safely: ignore duplicate / timing errors
  async function saveResponseSafe(payload: any) {
    try {
      await fetchNoJson("/api/QuizResponses", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    } catch {
      // ignore (duplicate / timing)
    }
  }

  async function submit(isAuto = false) {
    if (!quiz || !attemptId) return

    // 🔒 HARD LOCK (prevent double submit)
    if (submitLockRef.current) return
    submitLockRef.current = true

    autoSubmitDisabledRef.current = true
    setSubmitting(true)

    // stop timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    const id = attemptId

    try {
      // ✅ BLOCK MANUAL SUBMIT IF ANY QUESTION UNANSWERED
      const unanswered = quiz.questions.some(q => answers[q.id] == null)
      if (!isAuto && unanswered) {
        alert("⚠️ Please answer all questions before submitting.")
        submitLockRef.current = false
        setSubmitting(false)
        return
      }

      // 1️⃣ Save responses (even if auto and some are null)
      const payloads = quiz.questions.map(q => ({
        attemptId: id,
        questionId: q.id,
        selectedAnswerId: answers[q.id] ?? null,
      }))

      await Promise.all(payloads.map(p => saveResponseSafe(p)))

      // 2️⃣ Submit attempt
      const result = await apiFetch<{
        score: number
        earnedPoints: number
        totalPoints: number
        passed: boolean
      }>(`/api/QuizAttempts/${id}/submit`, {
        method: "PUT",
        body: JSON.stringify({
          timeTaken: TIME_LIMIT_SECONDS - secondsLeft,
        }),
      })

      setLastResult(result)

      await refreshMeta(quiz.id)

      // END attempt
      setAttemptId(null)
      setAnswers({})
      setSecondsLeft(TIME_LIMIT_SECONDS)

  if (result.passed) {
  // ✅ MUST include /api
  await apiFetch(
    `/api/Certificates?courseId=${courseId}`,
    { method: "POST" }
  )

  // small delay to ensure DB commit
  await new Promise(res => setTimeout(res, 300))

  alert(`✅ Passed! Score: ${result.score}%`)
  router.push("/dashboard/certificates")
  return
}



      alert(`❌ Failed. Score: ${result.score}%`)
    } catch (e: any) {
      alert(e.message || "Submit failed")
    } finally {
      setSubmitting(false)
      // keep submitLockRef locked for the duration of this submit
    }
  }

  if (loading) return <p>Loading quiz...</p>
  if (!quiz) return <p>No quiz available.</p>

  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, "0")

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
          <Button variant="outline" onClick={() => refreshMeta(quiz.id)}>Refresh</Button>
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
                    disabled={submitting}
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

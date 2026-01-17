"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ✅ ADD THIS HELPER
function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(atob(payload))
    return (
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    )
  } catch {
    return null
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("https://localhost:7026/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await res.json()

      // ✅ Save token (UNCHANGED)
      localStorage.setItem("token", data.token)

      // ✅ NEW: role-based redirect
      const role = getRoleFromToken(data.token)

      if (role === "Instructor") {
        router.push("/instructor/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <Label>Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary font-semibold">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

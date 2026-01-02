"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("https://localhost:7026/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })

      if (!res.ok) throw new Error("Registration failed")

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}

              <div>
                <Label>Full Name</Label>
                <Input onChange={e => setFullName(e.target.value)} />
              </div>

              <div>
                <Label>Email</Label>
                <Input onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>Password</Label>
                <Input type="password" onChange={e => setPassword(e.target.value)} />
              </div>

              <Button className="w-full">Sign Up</Button>
            </form>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

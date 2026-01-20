"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

type Certificate = {
  id: number
  courseTitle: string
  generatedAt: string
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await apiFetch<Certificate[]>("/api/Certificates/my")
        setCerts(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Certificates</h1>

      {certs.length === 0 ? (
        <p className="text-muted-foreground">No certificates yet.</p>
      ) : (
        certs.map(c => (
          <div
            key={c.id}
            className="border rounded p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{c.courseTitle}</p>
              <p className="text-sm text-muted-foreground">
                Generated: {new Date(c.generatedAt).toLocaleString()}
              </p>
            </div>

           <Button
  onClick={async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login again")
      return
    }

    const res = await fetch(
      `https://localhost:7026/api/Certificates/download/${c.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!res.ok) {
      const txt = await res.text()
      alert(txt || `HTTP ${res.status}`)
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `certificate-${c.id}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()

    window.URL.revokeObjectURL(url)
  }}
>
  Download PDF
</Button>

          </div>
        ))
      )}
    </div>
  )
}

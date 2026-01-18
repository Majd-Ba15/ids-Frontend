"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download } from "lucide-react"

type Certificate = {
  id: number
  courseTitle: string
  generatedAt: string
  downloadUrl?: string | null
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<Certificate[]>("/api/Certificates/my")
        setCerts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-muted-foreground">
          View and download your earned certificates
        </p>
      </div>

      {certs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {certs.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Award className="h-12 w-12 text-primary" />

                  {/* ✅ NO API_BASE, NO MANUAL URL */}
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={
                        cert.downloadUrl ??
                        `/api/Certificates/download/${cert.id}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <CardTitle className="mb-2">
                  {cert.courseTitle}
                </CardTitle>

                <CardDescription>
                  Completed on{" "}
                  {new Date(cert.generatedAt).toLocaleDateString()}
                </CardDescription>

                <div className="mt-4 p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Certificate Preview
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No certificates yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete courses to earn certificates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

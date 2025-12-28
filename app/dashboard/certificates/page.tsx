import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download } from "lucide-react"

export default function CertificatesPage() {
  const certificates = [
    {
      id: 1,
      courseName: "Introduction to Programming",
      completedDate: "2024-01-15",
      certificateUrl: "#",
    },
    {
      id: 2,
      courseName: "Advanced JavaScript",
      completedDate: "2024-02-20",
      certificateUrl: "#",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-muted-foreground">View and download your earned certificates</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Award className="h-12 w-12 text-primary" />
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{cert.courseName}</CardTitle>
                <CardDescription>Completed on {new Date(cert.completedDate).toLocaleDateString()}</CardDescription>
                <div className="mt-4 p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Certificate Preview</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
            <p className="text-muted-foreground mb-4">Complete courses to earn certificates</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

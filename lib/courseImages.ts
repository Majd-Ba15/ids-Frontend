export function getCourseImage(title: string) {
  const t = title.toLowerCase()

  if (t.includes("asp")) return "/web-development-course.png"
  if (t.includes("python")) return "/python-programming-concept.png"
  if (t.includes("data")) return "/python-data-science.png"
  if (t.includes("web")) return "/web-development-concept.png"

  return "/placeholder.jpg"
}

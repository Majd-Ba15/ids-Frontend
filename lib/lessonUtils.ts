export function buildLessonState(lessons: any[], completedIds: number[]) {
  return lessons.map((l, i) => {
    const prev = lessons[i - 1]
    const isCompleted = completedIds.includes(l.id)
    const isUnlocked =
      l.orderIndex === 1 ||
      (prev && completedIds.includes(prev.id))

    return { ...l, isCompleted, isUnlocked }
  })
}

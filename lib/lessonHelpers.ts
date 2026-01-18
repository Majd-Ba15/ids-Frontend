export function buildLessonState(
  lessons: any[],
  completedIds: number[]
) {
  return lessons.map((l, index) => {
    const prev = lessons[index - 1]
    const isCompleted = completedIds.includes(l.id)

    const isUnlocked =
      index === 0 ||
      (prev && completedIds.includes(prev.id))

    return {
      ...l,
      isCompleted,
      isUnlocked
    }
  })
}

export function calculateProgress(completedCount: number, totalLessons: number): number {
  if (totalLessons === 0) {
    return 0;
  }
  const percentage = (completedCount / totalLessons) * 100;
  return Math.round(percentage);
}
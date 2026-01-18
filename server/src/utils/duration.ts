// server/src/utils/duration.ts

export function parseToSeconds(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.some(isNaN)) return 0;

  if (parts.length === 2) {
    const min = parts[0] || 0;
    const sec = parts[1] || 0;
    return min * 60 + sec;
  } 
  
  if (parts.length === 3) {
    const hour = parts[0] || 0;
    const min = parts[1] || 0;
    const sec = parts[2] || 0;
    return hour * 3600 + min * 60 + sec;
  }
  
  return 0;
}

export function formatSeconds(totalSeconds: number): string {
  if (totalSeconds === 0) return "0 хв";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} год ${minutes} хв`;
  }
  return `${minutes} хв`;
}

export function getTotalDuration(lessons: { duration: string }[]): string {
  if (!lessons || lessons.length === 0) return "0 хв";

  const totalSeconds = lessons.reduce((acc, lesson) => {
    if (!lesson || !lesson.duration) return acc;
    return acc + parseToSeconds(lesson.duration);
  }, 0);

  return formatSeconds(totalSeconds);
}
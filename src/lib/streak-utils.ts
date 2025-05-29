import type { TaskLog } from '@/types';
import { parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';

export function calculateStreak(taskLogs: TaskLog[]): number {
  if (taskLogs.length === 0) {
    return 0;
  }

  // Filter for completed logs and get unique dates
  const completedDates = [
    ...new Set(
      taskLogs
        .filter((log) => log.completed)
        .map((log) => formatToYYYYMMDD(parseISO(log.date))) // Ensure date is in YYYY-MM-DD string format for Set
    ),
  ]
  .map(dateStr => parseISO(dateStr)) // Convert back to Date objects for sorting
  .sort((a, b) => b.getTime() - a.getTime()); // Sort dates in descending order (most recent first)

  if (completedDates.length === 0) {
    return 0;
  }
  
  let currentStreak = 0;
  const today = startOfDay(new Date());

  // Check if the most recent completed date is today or yesterday
  if (
    differenceInCalendarDays(today, completedDates[0]) === 0 ||
    differenceInCalendarDays(today, completedDates[0]) === 1
  ) {
    currentStreak = 1;
    for (let i = 0; i < completedDates.length - 1; i++) {
      const diff = differenceInCalendarDays(completedDates[i], completedDates[i + 1]);
      if (diff === 1) {
        currentStreak++;
      } else {
        // If the first day is not today, and not yesterday, streak broken unless it's exactly 1 day ago.
        // This logic is covered by the initial check against 'today'.
        // If diff > 1, the streak is broken.
        break; 
      }
    }
  } else {
    // If the most recent completion wasn't today or yesterday, streak is 0.
    return 0;
  }

  return currentStreak;
}

// Helper to format Date object to 'YYYY-MM-DD' string to ensure correct Set behavior for dates
function formatToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

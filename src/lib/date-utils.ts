import { format, parseISO, differenceInDays, startOfDay, addDays, isSameDay } from 'date-fns';

export const DATE_FORMAT_DB = 'yyyy-MM-dd'; // Format for storing dates
export const DATE_FORMAT_DISPLAY = 'MMMM d, yyyy'; // Format for display

export function getCurrentDateFormattedDB(): string {
  return format(new Date(), DATE_FORMAT_DB);
}

export function formatDateForDisplay(dateString: string): string {
  try {
    return format(parseISO(dateString), DATE_FORMAT_DISPLAY);
  } catch (error) {
    // if dateString is already in YYYY-MM-DD
     try {
        const [year, month, day] = dateString.split('-').map(Number);
        return format(new Date(year, month -1, day), DATE_FORMAT_DISPLAY);
     } catch (e) {
        console.error("Invalid date string for display:", dateString, e);
        return "Invalid Date";
     }
  }
}

export function formatISODateToDB(isoDateString: string): string {
  return format(parseISO(isoDateString), DATE_FORMAT_DB);
}


export function getDaysDifference(date1: string, date2: string): number {
  return differenceInDays(parseISO(date1), parseISO(date2));
}

export function getStartOfDay(dateString: string): Date {
  return startOfDay(parseISO(dateString));
}

export function addDaysToDate(dateString: string, days: number): string {
  return format(addDays(parseISO(dateString), days), DATE_FORMAT_DB);
}

export function isSameDate(date1String: string, date2String: string): boolean {
  const d1 = parseISO(date1String);
  const d2 = parseISO(date2String);
  return isSameDay(d1, d2);
}

export function getTodayInDBFormat(): string {
  return format(new Date(), DATE_FORMAT_DB);
}

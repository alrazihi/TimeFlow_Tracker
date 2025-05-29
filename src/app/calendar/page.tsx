import { MonthlyCalendarView } from "@/components/calendar/monthly-calendar-view";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
      <MonthlyCalendarView />
    </div>
  );
}

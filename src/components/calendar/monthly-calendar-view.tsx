"use client";

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useAppStore } from "@/store/app-store";
import type { Task, TaskLog } from "@/types";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DATE_FORMAT_DB } from '@/lib/date-utils';

interface DayRenderProps {
  date: Date;
  displayMonth: Date;
}

interface DailyTaskSummary {
  totalTasks: number;
  completedTasks: number;
  totalEstimatedTime: number;
  totalActualTime: number;
}

export function MonthlyCalendarView() {
  const tasks = useAppStore((state) => state.tasks);
  const taskLogs = useAppStore((state) => state.taskLogs);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailySummaries, setDailySummaries] = useState<Record<string, DailyTaskSummary>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const summaries: Record<string, DailyTaskSummary> = {};

    daysInMonth.forEach(day => {
      const dateStr = format(day, DATE_FORMAT_DB);
      const logsForDay = taskLogs.filter(log => log.date === dateStr);
      
      if (logsForDay.length > 0) {
        let totalTasks = logsForDay.length;
        let completedTasks = logsForDay.filter(log => log.completed).length;
        let totalEstimatedTime = 0;
        let totalActualTime = logsForDay.reduce((sum, log) => sum + log.actualTime, 0);

        logsForDay.forEach(log => {
          const task = tasks.find(t => t.id === log.taskId);
          if (task) {
            totalEstimatedTime += task.estimatedTime;
          }
        });
        
        summaries[dateStr] = { totalTasks, completedTasks, totalEstimatedTime, totalActualTime };
      }
    });
    setDailySummaries(summaries);

  }, [currentMonth, taskLogs, tasks, isMounted]);


  const DayContent = ({ date, displayMonth }: DayRenderProps) => {
    const dateStr = format(date, DATE_FORMAT_DB);
    const summary = dailySummaries[dateStr];
    
    // Only render content for days within the current display month
    if (date.getMonth() !== displayMonth.getMonth()) {
      return <div className="text-muted-foreground opacity-50">{format(date, 'd')}</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-1 text-center">
        <div>{format(date, 'd')}</div>
        {summary && (
          <div className="mt-0.5 text-xs">
            {summary.completedTasks > 0 && (
              <Badge variant={summary.completedTasks === summary.totalTasks ? "default" : "secondary"} className="bg-accent text-accent-foreground px-1 py-0">
                {summary.completedTasks}/{summary.totalTasks}
              </Badge>
            )}
            {summary.totalActualTime > 0 && (
               <Badge variant="outline" className="text-xs px-1 py-0 mt-0.5">{Math.round(summary.totalActualTime / 60 * 10)/10}h</Badge>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const selectedDateLogs = selectedDate ? taskLogs.filter(log => log.date === format(selectedDate, DATE_FORMAT_DB)) : [];

  if (!isMounted) {
    return <Card><CardHeader><CardTitle>Calendar</CardTitle></CardHeader><CardContent><p>Loading calendar...</p></CardContent></Card>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Visualize your task activity and logged time across the month.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border p-0"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              cell: "h-16 w-full text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-full w-full p-1.5 hover:bg-muted/50 rounded-md",
              caption_label: "text-lg font-medium",
            }}
            components={{
              DayContent: DayContent,
            }}
          />
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : "Select a Date"}
          </CardTitle>
          <CardDescription>Details for the selected day.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            selectedDateLogs.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <ul className="space-y-3">
                  {selectedDateLogs.map(log => {
                    const task = tasks.find(t => t.id === log.taskId);
                    return (
                      <li key={log.id} className="p-3 rounded-md border bg-card hover:bg-muted/30">
                        <p className="font-semibold">{task?.name || "Unknown Task"}</p>
                        <p className="text-sm text-muted-foreground">
                          Estimated: {task?.estimatedTime} min, Actual: {log.actualTime} min
                        </p>
                        {log.completed && <Badge className="mt-1 bg-accent text-accent-foreground">Completed</Badge>}
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No tasks logged for this day.</p>
            )
          ) : (
            <p className="text-muted-foreground">Select a day on the calendar to see details.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import type { Task } from "@/types";
import { BellRing, CheckSquare } from "lucide-react";
import Link from "next/link";

interface PendingTaskItem {
  task: Task;
  isLoggedToday: boolean;
}

export function RemindersCard() {
  const getTodaysPendingTasks = useAppStore((state) => state.getTodaysPendingTasks);
  const [pendingTasks, setPendingTasks] = useState<{task: Task}[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const tasksToLog = getTodaysPendingTasks().map(({task}) => ({task}));
      setPendingTasks(tasksToLog);
    }
  }, [getTodaysPendingTasks, isMounted, useAppStore.getState().tasks, useAppStore.getState().taskLogs]); // Re-run if tasks or logs change

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellRing className="mr-2 h-6 w-6 text-primary" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading reminders...</p>
        </CardContent>
      </Card>
    );
  }
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellRing className="mr-2 h-6 w-6 text-primary" />
          Today's Focus
        </CardTitle>
        <CardDescription>Tasks for today that need your attention.</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingTasks.length > 0 ? (
          <ul className="space-y-2">
            {pendingTasks.map(({ task }) => (
              <li key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                <span className="font-medium">{task.name}</span>
                <span className="text-sm text-muted-foreground">{task.estimatedTime} min</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <CheckSquare className="mx-auto h-12 w-12 text-accent" />
            <p className="mt-2 font-semibold">All Clear for Today!</p>
            <p className="text-sm text-muted-foreground">You've logged all your tasks or have a fresh start.</p>
             <Link href="/#todays-tasks" className="text-sm text-primary hover:underline mt-1 block">
              View or add tasks
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

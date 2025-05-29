"use client";

import type { Task, TaskLog } from "@/types";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasksWithLogs: { task: Task; log?: TaskLog }[];
  date: string; // YYYY-MM-DD
  emptyStateMessage?: string;
  onOpenEditTask?: (task: Task) => void;
}

export function TaskList({ tasksWithLogs, date, emptyStateMessage = "No tasks for this day.", onOpenEditTask }: TaskListProps) {
  if (tasksWithLogs.length === 0) {
    return <p className="text-muted-foreground italic">{emptyStateMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {tasksWithLogs.map(({ task, log }) => (
        <TaskItem key={task.id} task={task} log={log} date={date} onOpenEdit={onOpenEditTask} />
      ))}
    </div>
  );
}

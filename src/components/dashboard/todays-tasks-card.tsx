"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TaskList } from "@/components/tasks/task-list";
import { useAppStore } from "@/store/app-store";
import type { Task, TaskLog } from "@/types";
import { getTodayInDBFormat } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/task-form";
import { useToast } from "@/hooks/use-toast";

export function TodaysTasksCard() {
  const tasks = useAppStore((state) => state.tasks);
  const getTaskLogsForDate = useAppStore((state) => state.getTaskLogsForDate);
  const updateTask = useAppStore((state) => state.updateTask);
  const [today, setToday] = useState('');
  const [tasksWithLogs, setTasksWithLogs] = useState<{ task: Task; log?: TaskLog }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const currentToday = getTodayInDBFormat();
    setToday(currentToday);
  }, []);

  useEffect(() => {
    if (!isMounted || !today) return;

    const logs = getTaskLogsForDate(today);
    const combined = tasks.map(task => {
      const log = logs.find(l => l.taskId === task.id);
      return { task, log };
    });
    setTasksWithLogs(combined);
  }, [tasks, getTaskLogsForDate, today, isMounted]);


  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleEditTaskSubmit = (values: { name: string; estimatedTime: number }) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...values });
      toast({
        title: "Task Updated",
        description: `"${values.name}" has been updated.`,
      });
      setIsEditDialogOpen(false);
      setEditingTask(null);
    }
  };

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
           <CardDescription>Loading your tasks for today...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
        <CardDescription>Log your progress and mark tasks as completed.</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskList 
          tasksWithLogs={tasksWithLogs} 
          date={today} 
          emptyStateMessage="No tasks scheduled for today, or all are logged. Add new tasks or enjoy your free time!"
          onOpenEditTask={handleOpenEditTask}
        />
      </CardContent>
      {editingTask && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the details for your task.</DialogDescription>
            </DialogHeader>
            <TaskForm
              onSubmit={handleEditTaskSubmit}
              initialData={editingTask}
              submitButtonText="Save Changes"
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

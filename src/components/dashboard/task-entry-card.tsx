"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TaskForm } from "@/components/tasks/task-form";
import { useAppStore } from "@/store/app-store";
import { useToast } from "@/hooks/use-toast";

export function TaskEntryCard() {
  const addTask = useAppStore((state) => state.addTask);
  const { toast } = useToast();

  const handleAddTask = (values: { name: string; estimatedTime: number }) => {
    addTask(values);
    toast({
      title: "Task Added",
      description: `"${values.name}" has been added to your task list.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Plan your day by adding tasks and their estimated completion time.</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskForm onSubmit={handleAddTask} />
      </CardContent>
    </Card>
  );
}

"use client";

import type { Task, TaskLog } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Timer, CheckCircle2, Edit3, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface TaskItemProps {
  task: Task;
  log?: TaskLog; // Optional log for today
  date: string; // YYYY-MM-DD
  onOpenEdit?: (task: Task) => void;
}

export function TaskItem({ task, log, date, onOpenEdit }: TaskItemProps) {
  const { logTask, deleteTask, updateTaskLog } = useAppStore();
  const [actualTime, setActualTime] = useState(log?.actualTime || 0);
  const [isCompleted, setIsCompleted] = useState(log?.completed || false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setActualTime(log?.actualTime || 0);
    setIsCompleted(log?.completed || false);
  }, [log]);

  const handleLogTime = () => {
    if (actualTime < 0) {
      toast({ variant: "destructive", title: "Invalid Time", description: "Actual time cannot be negative."});
      return;
    }
    const newLog = logTask({
      taskId: task.id,
      date: date,
      actualTime: Number(actualTime),
      completed: isCompleted,
    });
    setIsEditingTime(false);
    toast({ title: "Time Logged", description: `Time updated for "${task.name}".`});
  };

  const handleToggleComplete = (checked: boolean) => {
    setIsCompleted(checked);
    logTask({
      taskId: task.id,
      date: date,
      actualTime: Number(actualTime),
      completed: checked,
    });
    toast({ title: checked ? "Task Completed" : "Task Marked Incomplete", description: `"${task.name}" status updated.`});
  };
  
  const handleDeleteTask = () => {
    deleteTask(task.id);
    toast({ title: "Task Deleted", description: `"${task.name}" has been removed.`});
  };

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{task.name}</CardTitle>
        <div className="flex items-center space-x-2">
          {onOpenEdit && (
            <Button variant="ghost" size="icon" onClick={() => onOpenEdit(task)} aria-label="Edit task">
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete task">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task "{task.name}" and all its associated logs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Estimated: {task.estimatedTime} min
        </p>
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-primary" />
          {isEditingTime || !log ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={actualTime}
                onChange={(e) => setActualTime(Number(e.target.value))}
                className="w-24 h-8"
                placeholder="Time spent"
                aria-label="Actual time spent in minutes"
              />
              <Button size="sm" onClick={handleLogTime} variant="outline">
                <Save className="h-4 w-4 mr-1" /> Log
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">Actual: {log.actualTime} min</span>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTime(true)} aria-label="Edit logged time">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`complete-${task.id}-${date}`}
            checked={isCompleted}
            onCheckedChange={handleToggleComplete}
            aria-label="Mark task as completed"
          />
          <Label htmlFor={`complete-${task.id}-${date}`} className="text-sm">
            {isCompleted ? "Completed" : "Mark as Complete"}
          </Label>
        </div>
        {isCompleted && <CheckCircle2 className="h-5 w-5 text-accent" />}
      </CardFooter>
    </Card>
  );
}

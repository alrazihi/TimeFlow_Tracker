"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import type { Task } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  estimatedTime: z.coerce.number().min(1, {
    message: "Estimated time must be at least 1 minute.",
  }),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  initialData?: Partial<Task>;
  submitButtonText?: string;
}

export function TaskForm({ onSubmit, initialData, submitButtonText = "Add Task" }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      estimatedTime: initialData?.estimatedTime || 0,
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values);
    if (!initialData) { // Reset form only if it's for adding new task
      form.reset({ name: "", estimatedTime: 0});
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Morning workout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Time (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="E.g., 30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

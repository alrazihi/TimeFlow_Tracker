"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { adjustTimeEstimates, type AdjustTimeEstimatesInput, type AdjustTimeEstimatesOutput } from "@/ai/flows/adjust-time-estimates";
import { Bot, Zap, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function AIEstimatorCard() {
  const tasks = useAppStore((state) => state.tasks);
  const getTaskLogsForTask = useAppStore((state) => state.getTaskLogsForTask);
  const updateTask = useAppStore((state) => state.updateTask);

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [currentEstimate, setCurrentEstimate] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AdjustTimeEstimatesOutput | null>(null);
  const { toast } = useToast();

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const handleGetSuggestion = async () => {
    if (!selectedTask || currentEstimate === "" || Number(currentEstimate) <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please select a task and enter a valid current estimate."});
      return;
    }

    setIsLoading(true);
    setSuggestion(null);

    const historicalLogs = getTaskLogsForTask(selectedTask.id);
    const actualTimes = historicalLogs.map(log => log.actualTime).filter(time => time > 0);

    // AI model might perform better with some history, or if not, it can indicate it.
    if (actualTimes.length < 1 && historicalLogs.length > 0) { // If there are logs but no actual time logged
      toast({ variant: "destructive", title: "Not Enough Data", description: "No actual time logged for this task yet to make a suggestion."});
      setIsLoading(false);
      return;
    }
    // If actualTimes is empty and there are no logs at all, the AI might still give a generic suggestion or ask for more data.

    const input: AdjustTimeEstimatesInput = {
      taskName: selectedTask.name,
      estimatedTime: Number(currentEstimate),
      actualTimes: actualTimes,
    };

    try {
      const result = await adjustTimeEstimates(input);
      setSuggestion(result);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({ variant: "destructive", title: "AI Error", description: "Could not get a suggestion at this time."});
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = () => {
    if (!selectedTask || !suggestion) return;

    const newEstimatedTime = Math.max(1, selectedTask.estimatedTime + suggestion.suggestedAdjustment);
    updateTask({ ...selectedTask, estimatedTime: newEstimatedTime });
    
    toast({
      title: "Estimate Updated",
      description: `Estimated time for "${selectedTask.name}" updated to ${newEstimatedTime} minutes.`,
    });
    setCurrentEstimate(newEstimatedTime);
    setSuggestion(null); // Clear suggestion after applying
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-6 w-6 text-primary" />
          AI Time Estimator
        </CardTitle>
        <CardDescription>Get AI-powered suggestions to refine your task time estimates based on historical data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="task-select">Select Task</Label>
          <Select
            value={selectedTaskId}
            onValueChange={(value) => {
              setSelectedTaskId(value);
              const task = tasks.find(t => t.id === value);
              setCurrentEstimate(task?.estimatedTime || "");
              setSuggestion(null); // Clear previous suggestion
            }}
          >
            <SelectTrigger id="task-select">
              <SelectValue placeholder="Choose a task..." />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTaskId && (
          <div>
            <Label htmlFor="current-estimate">Current Estimated Time (minutes)</Label>
            <Input
              id="current-estimate"
              type="number"
              value={currentEstimate}
              onChange={(e) => setCurrentEstimate(Number(e.target.value))}
              placeholder="E.g., 60"
            />
          </div>
        )}

        <Button onClick={handleGetSuggestion} disabled={isLoading || !selectedTaskId || currentEstimate === ""} className="w-full sm:w-auto">
          {isLoading ? (
            <Zap className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get Suggestion
        </Button>

        {suggestion && (
          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Lightbulb className="h-5 w-5 text-primary" />
            <AlertTitle className="font-semibold text-primary">AI Suggestion</AlertTitle>
            <AlertDescription className="space-y-2">
              <p><strong>Adjustment:</strong> {suggestion.suggestedAdjustment > 0 ? `+${suggestion.suggestedAdjustment}` : suggestion.suggestedAdjustment} minutes</p>
              <p><strong>Reason:</strong> {suggestion.reason}</p>
              <Button onClick={handleApplySuggestion} size="sm" className="mt-2">Apply Suggestion</Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

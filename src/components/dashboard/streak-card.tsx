"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function StreakCard() {
  const streak = useAppStore((state) => state.streak);
  const _recalculateStreak = useAppStore((state) => state._recalculateStreak);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // Recalculate streak on mount in case logs were updated in another tab or on initial load
    _recalculateStreak(); 
  }, [_recalculateStreak]);

  useEffect(() => {
    if (isMounted && streak > 0) {
      toast({
        title: "Great Job! 🎉",
        description: `You're on a ${streak}-day streak! Keep up the amazing work.`,
        duration: 5000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, isMounted]); // toast should only show when streak changes or on mount if streak > 0.

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            Completion Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">Loading...</p>
          <p className="text-sm text-muted-foreground">Calculating your current streak.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-6 w-6 text-primary" />
          Completion Streak
        </CardTitle>
        <CardDescription>Your current run of consecutive days with completed tasks.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {streak > 0 ? (
          <>
            <div className="flex items-center justify-center text-6xl font-bold text-primary">
              <Zap className="mr-2 h-12 w-12 fill-amber-400 text-amber-500" />
              {streak}
            </div>
            <p className="text-lg text-muted-foreground mt-1">
              {streak === 1 ? "Day" : "Days"} Strong!
            </p>
            <p className="text-sm mt-2">Keep the momentum going!</p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">No active streak. Complete a task today to start one!</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

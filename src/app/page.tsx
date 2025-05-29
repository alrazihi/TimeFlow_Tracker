import { TaskEntryCard } from "@/components/dashboard/task-entry-card";
import { TodaysTasksCard } from "@/components/dashboard/todays-tasks-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { AIEstimatorCard } from "@/components/dashboard/ai-estimator-card";
import { RemindersCard } from "@/components/dashboard/reminders-card";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <StreakCard />
          <RemindersCard />
        </div>
        <div className="lg:col-span-2 space-y-6">
           <TaskEntryCard />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AIEstimatorCard />
        <div className="relative min-h-[200px] md:min-h-[300px] rounded-lg overflow-hidden shadow-lg">
           <Image 
            src="https://placehold.co/600x400.png" 
            alt="Productivity illustration" 
            layout="fill"
            objectFit="cover"
            data-ai-hint="productivity workspace"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-lg font-semibold text-white">Stay Focused, Achieve More</h3>
            <p className="text-sm text-neutral-200">TimeFlow helps you master your day.</p>
          </div>
        </div>
      </div>

      <div id="todays-tasks">
        <TodaysTasksCard />
      </div>

    </div>
  );
}

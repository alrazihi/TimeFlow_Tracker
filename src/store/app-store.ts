import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, TaskLog } from '@/types';
import { getCurrentDateFormattedDB, getTodayInDBFormat } from '@/lib/date-utils';
import { calculateStreak } from '@/lib/streak-utils';

interface AppState {
  tasks: Task[];
  taskLogs: TaskLog[];
  streak: number;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  logTask: (log: Omit<TaskLog, 'id'>) => TaskLog;
  updateTaskLog: (log: TaskLog) => void;
  getTaskLogsForDate: (date: string) => TaskLog[];
  getTaskLogsForTask: (taskId: string) => TaskLog[];
  getTodaysPendingTasks: () => { task: Task; log?: TaskLog }[];
  _recalculateStreak: () => void; // Internal function to update streak
}

const initialTasks: Task[] = [
  { id: '1', name: 'Morning Meditation', estimatedTime: 15, createdAt: new Date().toISOString() },
  { id: '2', name: 'Project Proposal Writing', estimatedTime: 120, createdAt: new Date().toISOString() },
  { id: '3', name: 'Exercise', estimatedTime: 45, createdAt: new Date().toISOString() },
];

const initialLogs: TaskLog[] = [];


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      taskLogs: initialLogs,
      streak: 0,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },
      updateTask: (updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }));
      },
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          taskLogs: state.taskLogs.filter((log) => log.taskId !== taskId), // Also remove logs for this task
        }));
        get()._recalculateStreak();
      },
      getTaskById: (taskId) => {
        return get().tasks.find(task => task.id === taskId);
      },
      logTask: (logData) => {
        // Check if a log for this task on this date already exists
        const existingLogIndex = get().taskLogs.findIndex(
          (log) => log.taskId === logData.taskId && log.date === logData.date
        );

        let newLog: TaskLog;
        if (existingLogIndex > -1) {
          // Update existing log
          newLog = { ...get().taskLogs[existingLogIndex], ...logData };
          set((state) => {
            const updatedLogs = [...state.taskLogs];
            updatedLogs[existingLogIndex] = newLog;
            return { taskLogs: updatedLogs };
          });
        } else {
          // Add new log
          newLog = {
            ...logData,
            id: Date.now().toString(),
          };
          set((state) => ({ taskLogs: [...state.taskLogs, newLog] }));
        }
        get()._recalculateStreak();
        return newLog;
      },
      updateTaskLog: (updatedLog) => {
         set((state) => ({
          taskLogs: state.taskLogs.map((log) =>
            log.id === updatedLog.id ? updatedLog : log
          ),
        }));
        get()._recalculateStreak();
      },
      getTaskLogsForDate: (date) => {
        return get().taskLogs.filter((log) => log.date === date);
      },
      getTaskLogsForTask: (taskId) => {
        return get().taskLogs.filter((log) => log.taskId === taskId);
      },
      getTodaysPendingTasks: () => {
        const today = getTodayInDBFormat();
        const todaysLogs = get().getTaskLogsForDate(today);
        
        return get().tasks.map(task => {
          const log = todaysLogs.find(l => l.taskId === task.id);
          return { task, log };
        }).filter(({ log }) => !log || !log.completed);
      },
      _recalculateStreak: () => {
        const newStreak = calculateStreak(get().taskLogs);
        set({ streak: newStreak });
      },
    }),
    {
      name: 'timeflow-tracker-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        if (state) state._recalculateStreak();
      }
    }
  )
);

// Initial streak calculation after store is loaded
useAppStore.getState()._recalculateStreak();

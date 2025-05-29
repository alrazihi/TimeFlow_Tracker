
export interface Task {
  id: string;
  name: string;
  estimatedTime: number; // in minutes
  createdAt: string; // ISO date string
}

export interface TaskLog {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  actualTime: number; // in minutes
  completed: boolean;
}

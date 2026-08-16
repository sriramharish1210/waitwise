export interface ScheduledTask {
  taskId: string;
  taskName: string;
  startMinute: number;
  endMinute: number;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface ExcludedTask {
  taskId: string;
  taskName: string;
  reason: string;
}

export interface WaitPlan {
  availableMinutes: number;
  usedMinutes: number;
  bufferMinutes: number;
  schedule: ScheduledTask[];
  excludedTasks: ExcludedTask[];
  strategy: string;
  summary: string;
  replanExplanation?: string;
}

export interface PlanValidationResult {
  isValid: boolean;
  errors: string[];
}

import { Task } from "@/types/task";
import { WaitPlan, PlanValidationResult } from "@/types/plan";

export function validateWaitPlan(
  plan: WaitPlan,
  originalTasks: Task[],
  availableMinutes: number
): PlanValidationResult {
  const errors: string[] = [];

  // 1. Buffer is non-negative
  if (plan.bufferMinutes < 0) {
    errors.push(`Buffer minutes cannot be negative: ${plan.bufferMinutes}`);
  }

  // 2. Used minutes and buffer minutes match total
  const calculatedUsedMinutes = plan.schedule.reduce((acc, t) => acc + t.duration, 0);
  if (calculatedUsedMinutes !== plan.usedMinutes) {
    errors.push(`Reported usedMinutes (${plan.usedMinutes}) does not match sum of scheduled task durations (${calculatedUsedMinutes})`);
  }

  // 3. Schedule stays within available window
  if (plan.usedMinutes + plan.bufferMinutes > availableMinutes) {
    errors.push(`Total planned time (${plan.usedMinutes} min used + ${plan.bufferMinutes} min buffer = ${plan.usedMinutes + plan.bufferMinutes} min) exceeds available time (${availableMinutes} min)`);
  }

  // 4. Validate each scheduled task
  const taskMap = new Map(originalTasks.map(t => [t.id, t]));
  const scheduledTaskIds = new Set<string>();

  // Sort schedule by startMinute to check for overlaps
  const sortedSchedule = [...plan.schedule].sort((a, b) => a.startMinute - b.startMinute);

  for (let i = 0; i < sortedSchedule.length; i++) {
    const task = sortedSchedule[i];

    // Check referenced task IDs exist
    if (!taskMap.has(task.taskId)) {
      errors.push(`Scheduled task references non-existent taskId: "${task.taskId}"`);
    }

    // No negative durations
    if (task.duration <= 0) {
      errors.push(`Scheduled task "${task.taskName}" must have a positive duration, got: ${task.duration}`);
    }

    // Valid start/end times
    if (task.startMinute < 0) {
      errors.push(`Scheduled task "${task.taskName}" start minute cannot be negative: ${task.startMinute}`);
    }
    if (task.endMinute !== task.startMinute + task.duration) {
      errors.push(`Scheduled task "${task.taskName}" end minute (${task.endMinute}) must equal start minute (${task.startMinute}) plus duration (${task.duration})`);
    }
    if (task.endMinute > availableMinutes) {
      errors.push(`Scheduled task "${task.taskName}" ends at ${task.endMinute} min, which is outside the available window of ${availableMinutes} min`);
    }

    // No duplicate scheduling of same task
    if (scheduledTaskIds.has(task.taskId)) {
      errors.push(`Task "${task.taskName}" (ID: ${task.taskId}) is scheduled multiple times`);
    }
    scheduledTaskIds.add(task.taskId);

    // No overlapping tasks
    if (i > 0) {
      const prevTask = sortedSchedule[i - 1];
      if (task.startMinute < prevTask.endMinute) {
        errors.push(`Overlap detected: "${task.taskName}" starts at ${task.startMinute} min before previous task "${prevTask.taskName}" ends at ${prevTask.endMinute} min`);
      }
    }
  }

  // Check that excluded tasks reference valid tasks
  for (const ext of plan.excludedTasks) {
    if (!taskMap.has(ext.taskId)) {
      errors.push(`Excluded task references non-existent taskId: "${ext.taskId}"`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

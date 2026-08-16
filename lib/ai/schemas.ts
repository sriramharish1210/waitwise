import { z } from "zod";
import { SchemaType, Schema } from "@google/generative-ai";

// 1. Zod schemas for application validation
export const ScheduledTaskSchema = z.object({
  taskId: z.string(),
  taskName: z.string(),
  startMinute: z.number().int().nonnegative(),
  endMinute: z.number().int().nonnegative(),
  duration: z.number().int().positive(),
  priority: z.enum(["high", "medium", "low"]),
  reason: z.string(),
});

export const ExcludedTaskSchema = z.object({
  taskId: z.string(),
  taskName: z.string(),
  reason: z.string(),
});

export const WaitPlanSchema = z.object({
  availableMinutes: z.number().int().positive(),
  usedMinutes: z.number().int().nonnegative(),
  bufferMinutes: z.number().int().nonnegative(),
  schedule: z.array(ScheduledTaskSchema),
  excludedTasks: z.array(ExcludedTaskSchema),
  strategy: z.string(),
  summary: z.string(),
  replanExplanation: z.string().optional(),
});

export const DurationEstimationSchema = z.object({
  estimatedMinutes: z.number().int().positive(),
  reason: z.string(),
});

// 2. Gemini native schemas for structured API formatting
export const geminiWaitPlanSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    availableMinutes: {
      type: SchemaType.INTEGER,
      description: "Total available waiting time in minutes."
    },
    usedMinutes: {
      type: SchemaType.INTEGER,
      description: "Total time allocated for tasks in minutes (sum of scheduled task durations)."
    },
    bufferMinutes: {
      type: SchemaType.INTEGER,
      description: "Allocated safety buffer in minutes. Must be determined dynamically."
    },
    schedule: {
      type: SchemaType.ARRAY,
      description: "Chronologically ordered list of scheduled tasks.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          taskId: { type: SchemaType.STRING },
          taskName: { type: SchemaType.STRING },
          startMinute: { type: SchemaType.INTEGER, description: "Start minute offset (starts at 0)." },
          endMinute: { type: SchemaType.INTEGER, description: "End minute offset (startMinute + duration)." },
          duration: { type: SchemaType.INTEGER, description: "Duration of the task in minutes." },
          priority: { 
            type: SchemaType.STRING, 
            enum: ["high", "medium", "low"] 
          },
          reason: { type: SchemaType.STRING, description: "Reason why this task was scheduled/prioritized." }
        },
        required: ["taskId", "taskName", "startMinute", "endMinute", "duration", "priority", "reason"]
      }
    },
    excludedTasks: {
      type: SchemaType.ARRAY,
      description: "Tasks that could not fit into the schedule.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          taskId: { type: SchemaType.STRING },
          taskName: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING, description: "Specific reason why this task was excluded." }
        },
        required: ["taskId", "taskName", "reason"]
      }
    },
    strategy: {
      type: SchemaType.STRING,
      description: "The strategy name used for optimization (e.g. priority_and_time_fit)."
    },
    summary: {
      type: SchemaType.STRING,
      description: "A short, concise summary of the plan."
    },
    replanExplanation: {
      type: SchemaType.STRING,
      description: "Only for replanning. Explanation of what changed from the previous plan (e.g. why task was excluded/reordered due to decreased/increased time)."
    }
  },
  required: ["availableMinutes", "usedMinutes", "bufferMinutes", "schedule", "excludedTasks", "strategy", "summary"]
};

export const geminiDurationEstimationSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    estimatedMinutes: {
      type: SchemaType.INTEGER,
      description: "Estimated realistic duration for the task in minutes."
    },
    reason: {
      type: SchemaType.STRING,
      description: "Reasoning behind the duration estimation, citing factors of the waiting situation."
    }
  },
  required: ["estimatedMinutes", "reason"]
};

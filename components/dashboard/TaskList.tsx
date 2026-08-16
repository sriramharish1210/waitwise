"use client";

import React from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  onUpdateTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: Props) {
  if (tasks.length === 0) {
    return (
      <div style={{
        padding: "36px 0", textAlign: "center",
        border: "1px dashed var(--border-subtle)", borderRadius: 12,
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ margin: "0 auto 12px", display: "block" }}>
          <circle cx="14" cy="14" r="12.5" stroke="var(--border-default)" strokeWidth="1.2"/>
          <path d="M14 9V14.5L17.5 17" stroke="var(--border-default)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>No tasks yet</p>
        <p style={{ fontSize: 11, color: "var(--text-faint)" }}>Add tasks using the panel →</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="anim-fade-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <TaskItem
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      ))}
    </div>
  );
}
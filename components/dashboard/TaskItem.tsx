"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";

interface Props {
  task: Task;
  onUpdateTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}

const DOT: Record<string, string> = { high: "var(--p-high)", medium: "var(--p-med)", low: "var(--p-low)" };
const TAG: Record<string, string> = { high: "HIGH", medium: "MED", low: "LOW" };

export default function TaskItem({ task, onUpdateTask, onDeleteTask }: Props) {
  const [editing, setEditing] = useState(false);
  const [eName, setEName]     = useState(task.name);
  const [eDur, setEDur]       = useState(task.duration);
  const [ePri, setEPri]       = useState(task.priority);

  const saveEdit = () => {
    if (!eName.trim() || eDur <= 0) return;
    onUpdateTask({ ...task, name: eName.trim(), duration: eDur, priority: ePri });
    setEditing(false);
  };
  const cancelEdit = () => {
    setEName(task.name); setEDur(task.duration); setEPri(task.priority);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="anim-fade-up" style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border-accent)",
        borderRadius: 12, padding: "14px",
      }}>
        <input
          type="text" value={eName} onChange={e => setEName(e.target.value)}
          autoFocus className="glass-input"
          style={{ width: "100%", padding: "9px 12px", fontSize: 13, marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number" min="1" value={eDur}
            onChange={e => setEDur(Math.max(1, Number(e.target.value)))}
            className="glass-input"
            style={{ width: 70, padding: "9px 10px", fontSize: 13, textAlign: "center" }}
          />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>min</span>
          <select
            value={ePri}
            onChange={e => setEPri(e.target.value as any)}
            className="glass-input"
            style={{ flex: 1, padding: "9px 10px", fontSize: 12 }}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={saveEdit} style={{
            fontSize: 11, fontWeight: 700, color: "var(--bg-void)", background: "var(--success)",
            border: "none", borderRadius: 8, padding: "9px 14px", cursor: "pointer", fontFamily: "inherit",
          }}>Save</button>
          <button onClick={cancelEdit} style={{
            fontSize: 11, fontWeight: 500, color: "var(--text-secondary)",
            background: "none", border: "1px solid var(--border-subtle)",
            borderRadius: 8, padding: "9px 14px", cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-faint)",
        borderRadius: 12, padding: "13px 15px",
        display: "flex", alignItems: "center", gap: 12,
        transition: "border-color 0.18s ease, background 0.18s ease, transform 0.18s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border-faint)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Priority dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: DOT[task.priority], flexShrink: 0,
        boxShadow: `0 0 6px ${DOT[task.priority]}66`,
      }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3,
        }}>
          {task.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>
            {task.duration} min
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            color: DOT[task.priority],
          }}>
            {TAG[task.priority]}
          </span>
          {task.isAIEstimated && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: "var(--accent)",
              letterSpacing: "0.08em",
            }}>AI</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {[
          { icon: "edit", action: () => setEditing(true), title: "Edit" },
          { icon: "delete", action: () => onDeleteTask(task.id), title: "Delete" },
        ].map(({ icon, action, title }) => (
          <button
            key={icon}
            onClick={action}
            title={title}
            style={{
              width: 30, height: 30, borderRadius: 8,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "1px solid transparent",
              color: "var(--text-muted)", cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              if (icon === "delete") {
                e.currentTarget.style.background = "var(--danger-dim)";
                e.currentTarget.style.borderColor = "rgba(240,112,106,0.2)";
                e.currentTarget.style.color = "var(--danger)";
              } else {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {icon === "edit" ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3H10M4 3V2H8V3M5 5.5V9M7 5.5V9M3 3L3.5 10H8.5L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
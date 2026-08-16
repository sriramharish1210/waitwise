"use client";

import React, { useState } from "react";

interface Props {
  situation: string;
  onAddTask: (t: { name: string; duration: number; priority: "high"|"medium"|"low"; isAIEstimated?: boolean }) => void;
}

const PRI = {
  high:   { label: "High",   color: "var(--p-high)",   bg: "var(--p-high-dim)",   border: "var(--p-high-border)" },
  medium: { label: "Med",    color: "var(--p-med)",    bg: "var(--p-med-dim)",    border: "var(--p-med-border)" },
  low:    { label: "Low",    color: "var(--p-low)",    bg: "var(--p-low-dim)",    border: "var(--p-low-border)" },
};

export default function TaskInput({ situation, onAddTask }: Props) {
  const [name, setName]       = useState("");
  const [dur, setDur]         = useState<number | "">("");
  const [pri, setPri]         = useState<"high"|"medium"|"low">("medium");
  const [estimating, setEst]  = useState(false);
  const [estErr, setEstErr]   = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!name.trim()) { setEstErr("Enter a task name first."); return; }
    setEst(true); setEstErr(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, taskName: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Estimate failed.");
      if (data.estimatedMinutes) setDur(data.estimatedMinutes);
    } catch (e: any) {
      setEstErr(e.message || "Agent unavailable.");
    } finally { setEst(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dur || Number(dur) <= 0) return;
    onAddTask({ name: name.trim(), duration: Number(dur), priority: pri });
    setName(""); setDur(""); setPri("medium"); setEstErr(null);
  };

  const canSubmit = !!name.trim() && !!dur && Number(dur) > 0 && !estimating;

  return (
    <form onSubmit={handleSubmit} className="glass" style={{ padding: "20px 22px" }}>
      <p className="label-micro" style={{ marginBottom: 14 }}>Add task</p>

      {/* Name + AI estimate */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Task name" className="glass-input"
          style={{ flex: 1, padding: "10px 13px", fontSize: 13 }}
        />
        <button
          type="button" onClick={handleEstimate}
          disabled={estimating || !name.trim()}
          style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, fontWeight: 600,
            color: estimating ? "var(--text-muted)" : "var(--accent-bright)",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            borderRadius: 10, padding: "10px 12px",
            cursor: estimating || !name.trim() ? "not-allowed" : "pointer",
            opacity: !name.trim() ? 0.4 : 1,
            transition: "opacity 0.15s",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          {estimating ? (
            <>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                border: "1.5px solid var(--accent)", borderTopColor: "transparent",
                display: "inline-block", animation: "spin 0.7s linear infinite",
              }} />
              Estimating
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L6.18 3.82L9.5 5L6.18 6.18L5 9L3.82 6.18L0.5 5L3.82 3.82L5 1Z" fill="currentColor"/>
              </svg>
              AI estimate
            </>
          )}
        </button>
      </div>

      {/* Duration + Priority */}
      <div style={{ display: "flex", gap: 8, marginBottom: estErr ? 10 : 14 }}>
        <input
          type="number" min="1" value={dur}
          onChange={e => setDur(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))}
          placeholder="Minutes" className="glass-input"
          style={{ flex: 1, padding: "10px 13px", fontSize: 13 }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {(["high","medium","low"] as const).map(p => {
            const cfg = PRI[p]; const active = pri === p;
            return (
              <button key={p} type="button" onClick={() => setPri(p)} style={{
                fontSize: 10, fontWeight: 700,
                color: active ? cfg.color : "var(--text-muted)",
                background: active ? cfg.bg : "transparent",
                border: `1px solid ${active ? cfg.border : "var(--border-subtle)"}`,
                borderRadius: 8, padding: "0 8px", height: 40,
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "inherit",
              }}>
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {estErr && <p style={{ fontSize: 11, color: "var(--danger)", marginBottom: 10 }}>{estErr}</p>}

      <button
        type="submit" disabled={!canSubmit}
        style={{
          width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center",
          gap: 8, fontSize: 13, fontWeight: 600,
          color: canSubmit ? "var(--bg-void)" : "var(--text-faint)",
          background: canSubmit ? "var(--text-primary)" : "rgba(255,255,255,0.04)",
          border: canSubmit ? "none" : "1px solid var(--border-subtle)",
          borderRadius: 10, padding: "11px", cursor: canSubmit ? "pointer" : "not-allowed",
          opacity: canSubmit ? 1 : 0.4, transition: "all 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = canSubmit ? "1" : "0.4"; }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Add task
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
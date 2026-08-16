"use client";

import React from "react";
import { WaitPlan } from "@/types/plan";
import TimelineTask from "./TimelineTask";

interface Props {
  plan: WaitPlan | null;
  availableMinutes: number;
}

function getTickInterval(total: number) {
  if (total <= 15) return 5;
  if (total <= 30) return 5;
  if (total <= 60) return 10;
  if (total <= 90) return 15;
  return 20;
}

export default function Timeline({ plan, availableMinutes }: Props) {
  const interval = getTickInterval(availableMinutes);
  const ticks: number[] = [];
  for (let t = 0; t <= availableMinutes; t += interval) ticks.push(t);
  if (ticks[ticks.length - 1] !== availableMinutes) ticks.push(availableMinutes);

  if (!plan) {
    return (
      <div className="glass" style={{ padding: "24px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p className="label-micro">Timeline</p>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{availableMinutes} min window</span>
        </div>
        <div style={{
          height: 58, background: "rgba(255,255,255,0.02)",
          border: "1px dashed var(--border-subtle)", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Optimize to see your timeline</span>
        </div>
        <TimeRuler ticks={ticks} availableMinutes={availableMinutes} />
      </div>
    );
  }

  const { schedule, bufferMinutes } = plan;
  const totalUsed = schedule.reduce((s, t) => s + t.duration, 0);
  const unusedMin = Math.max(0, availableMinutes - totalUsed - bufferMinutes);
  const efficiency = Math.round((totalUsed / availableMinutes) * 100);

  return (
    <div className="glass anim-fade-up" style={{ padding: "24px 26px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.2"/>
            <path d="M7 4V7.5L10 9" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <p className="label-micro">Your time window</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {totalUsed}m of {availableMinutes}m scheduled
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
            color: efficiency >= 65 ? "var(--success)" : "var(--text-muted)",
            background: efficiency >= 65 ? "var(--success-dim)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${efficiency >= 65 ? "rgba(62,207,160,0.2)" : "var(--border-subtle)"}`,
            borderRadius: 100, padding: "3px 10px",
          }}>
            {efficiency}% used
          </span>
        </div>
      </div>

      {/* ── Timeline track ───────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, width: "100%", height: 58, position: "relative" }}>

        {/* Subtle grid lines in background */}
        {ticks.filter(t => t > 0 && t < availableMinutes).map(t => (
          <div key={t} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${(t / availableMinutes) * 100}%`,
            width: 1, background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }} />
        ))}

        {schedule.map((task, i) => (
          <TimelineTask
            key={task.taskId}
            name={task.taskName}
            duration={task.duration}
            startMinute={task.startMinute}
            endMinute={task.endMinute}
            priority={task.priority}
            widthPercent={(task.duration / availableMinutes) * 100}
            reason={task.reason}
            index={i}
          />
        ))}

        {bufferMinutes > 0 && (
          <TimelineTask
            name="Safety buffer"
            duration={bufferMinutes}
            startMinute={availableMinutes - bufferMinutes - unusedMin}
            endMinute={availableMinutes - unusedMin}
            widthPercent={(bufferMinutes / availableMinutes) * 100}
            isBuffer
            reason="Reserved dynamically — accounts for uncertainty in your waiting window."
            index={schedule.length}
          />
        )}

        {unusedMin > 0 && (
          <TimelineTask
            name="Unused"
            duration={unusedMin}
            startMinute={availableMinutes - unusedMin}
            endMinute={availableMinutes}
            widthPercent={(unusedMin / availableMinutes) * 100}
            isUnused
            index={schedule.length + 1}
          />
        )}
      </div>

      {/* ── Time ruler ────────────────────────────────────── */}
      <TimeRuler ticks={ticks} availableMinutes={availableMinutes} />

      {/* ── Legend ────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 18, marginTop: 18,
        paddingTop: 16, borderTop: "1px solid var(--border-faint)",
        flexWrap: "wrap",
      }}>
        {schedule.length > 0 && <LegendItem label="Scheduled" colors={["#F0706A","#F0A84A","#6395FF"]} />}
        {bufferMinutes > 0 && <LegendItem label="Safety buffer" color="#7A6B9A" dashed />}
        {unusedMin > 0 && <LegendItem label="Unused" color="#2D3748" dashed />}
      </div>
    </div>
  );
}

function TimeRuler({ ticks, availableMinutes }: { ticks: number[]; availableMinutes: number }) {
  return (
    <div style={{ position: "relative", height: 24, marginTop: 6 }}>
      {/* Baseline */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "var(--border-subtle)" }} />
      {ticks.map(t => {
        const pct = (t / availableMinutes) * 100;
        return (
          <React.Fragment key={t}>
            <div style={{
              position: "absolute", top: 0, left: `${pct}%`,
              width: 1, height: 6, background: "var(--border-strong)",
              transform: "translateX(-50%)",
            }} />
            <span style={{
              position: "absolute", top: 9, left: `${pct}%`,
              transform: "translateX(-50%)",
              fontSize: 9, fontWeight: 600, color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}>
              {t}m
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function LegendItem({ label, color, colors, dashed }: {
  label: string; color?: string; colors?: string[]; dashed?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {colors ? colors.map((c, i) => (
          <div key={i} style={{ width: 10, height: 3, borderRadius: 2, background: c }} />
        )) : (
          <div style={{
            width: 24, height: 3, borderRadius: 2,
            background: dashed ? "none" : color,
            border: dashed ? `1px dashed ${color}` : "none",
          }} />
        )}
      </div>
      <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}
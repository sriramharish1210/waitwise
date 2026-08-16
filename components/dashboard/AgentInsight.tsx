"use client";

import React, { useState } from "react";
import { WaitPlan } from "@/types/plan";

interface Props { plan: WaitPlan; }

export default function AgentInsight({ plan }: Props) {
  const [expanded, setExpanded] = useState(true);
  const unused = Math.max(0, plan.availableMinutes - plan.usedMinutes - plan.bufferMinutes);

  const stats = [
    { label: "Available", val: plan.availableMinutes, color: "var(--text-secondary)", unit: "m" },
    { label: "Scheduled", val: plan.usedMinutes,      color: "var(--success)",        unit: "m" },
    { label: "Buffer",    val: plan.bufferMinutes,     color: "var(--accent)",         unit: "m" },
    { label: "Unused",    val: unused,                 color: "var(--text-muted)",     unit: "m" },
  ];

  return (
    <div className="glass anim-fade-up" style={{ padding: "24px 26px", animationDelay: "80ms" }}>

      {/* ── Header ───────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z"
              fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          <p className="label-micro">Agent insight</p>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: 4,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }}>
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Stats row ────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: expanded ? 20 : 0,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-faint)",
            borderRadius: 12, padding: "12px 10px", textAlign: "center",
          }}>
            <p style={{
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.06em",
              color: s.color, lineHeight: 1, marginBottom: 6,
            }}>
              {s.val}
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0 }}>m</span>
            </p>
            <p style={{
              fontSize: 9, fontWeight: 700, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Expandable detail ────────────────────── */}
      {expanded && (
        <div className="anim-fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Replan explanation */}
          {plan.replanExplanation && (
            <div style={{
              background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <p className="label-micro" style={{ color: "var(--accent)", marginBottom: 7 }}>Window changed</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {plan.replanExplanation}
              </p>
            </div>
          )}

          {/* Summary */}
          <div>
            <p className="label-micro" style={{ marginBottom: 8 }}>Why this plan?</p>
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {plan.summary}
              </p>
            </div>
          </div>

          {/* Strategy */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p className="label-micro">Strategy</p>
            <span style={{
              fontSize: 11, fontWeight: 600, color: "var(--text-secondary)",
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)",
              borderRadius: 100, padding: "3px 11px", textTransform: "capitalize",
            }}>
              {plan.strategy.replace(/_/g, " ")}
            </span>
          </div>

          {/* Excluded */}
          {plan.excludedTasks.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="var(--danger)" strokeWidth="1"/>
                  <path d="M5.5 3.5V5.5M5.5 7.5H5.51" stroke="var(--danger)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <p className="label-micro" style={{ color: "var(--danger)" }}>
                  Excluded ({plan.excludedTasks.length})
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {plan.excludedTasks.map(t => (
                  <div key={t.taskId} style={{
                    background: "var(--danger-dim)", border: "1px solid rgba(240,112,106,0.15)",
                    borderRadius: 10, padding: "11px 14px",
                  }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
                      {t.taskName}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import React from "react";

interface Props {
  onUndo: () => void;
  previousMinutes: number;
  currentMinutes: number;
  visible: boolean;
  onClose: () => void;
}

export default function ReplanNotice({ onUndo, previousMinutes, currentMinutes, visible, onClose }: Props) {
  if (!visible) return null;

  return (
    <div className="anim-slide-right glass" style={{
      padding: "14px 18px",
      display: "flex", alignItems: "center", gap: 14,
      borderColor: "var(--accent-border)",
      background: "rgba(99,149,255,0.06)",
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.2"/>
        <path d="M7 4V7L9.5 9" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          Plan updated
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", opacity: 0.5, textDecoration: "line-through", letterSpacing: "-0.04em" }}>
            {previousMinutes}m
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--accent-bright)", letterSpacing: "-0.04em" }}>
            {currentMinutes}m
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— schedule recalculated</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
        <button
          onClick={onUndo}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "var(--text-primary)",
            background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-default)",
            borderRadius: 8, padding: "7px 13px", cursor: "pointer",
            transition: "all 0.15s", fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 4.5H7C8.66 4.5 10 5.84 10 7.5C10 9.16 8.66 10.5 7 10.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M4 2L1.5 4.5L4 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Undo
        </button>
        <button
          onClick={onClose}
          style={{
            width: 26, height: 26, borderRadius: 6,
            background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
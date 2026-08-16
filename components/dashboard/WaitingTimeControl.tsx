"use client";

import React from "react";

interface Props {
  activeMinutes: number;
  tempMinutes: number;
  onChangeTempMinutes: (v: number) => void;
  onTriggerReplan: (v: number) => void;
  hasPlan: boolean;
  isLoading: boolean;
}

export default function WaitingTimeControl({
  activeMinutes, tempMinutes, onChangeTempMinutes, onTriggerReplan, hasPlan, isLoading,
}: Props) {
  const changed = tempMinutes !== activeMinutes && hasPlan;
  const ticks = [0, 15, 30, 45, 60, 90, 120];
  const sliderVal = Math.min(tempMinutes, 120);

  return (
    <div className="glass" style={{ padding: "20px 22px" }}>
      {/* Header + big number */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p className="label-micro" style={{ marginBottom: 6 }}>Available time</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <input
              type="number" min="1" max="300"
              value={tempMinutes}
              onChange={e => onChangeTempMinutes(Math.max(1, Number(e.target.value)))}
              style={{
                width: 72, background: "none", border: "none", outline: "none",
                fontSize: 42, fontWeight: 800, letterSpacing: "-0.06em",
                color: changed ? "var(--accent-bright)" : "var(--text-primary)",
                padding: 0, cursor: "text", fontFamily: "inherit",
                transition: "color 0.2s ease",
              }}
            />
            <span style={{
              fontSize: 16, fontWeight: 600, color: "var(--text-muted)",
              marginBottom: 4, letterSpacing: "-0.02em",
            }}>min</span>
          </div>
        </div>

        {/* Mini time arc indicator */}
        <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Track */}
            <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none"/>
            {/* Progress — arc proportional to time (max 120min = full) */}
            <circle
              cx="24" cy="24" r="18"
              stroke={changed ? "var(--accent)" : "var(--text-muted)"}
              strokeWidth="3" fill="none"
              strokeDasharray={`${(Math.min(tempMinutes, 120) / 120) * 113} 113`}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.2s ease" }}
            />
            <text x="24" y="28" textAnchor="middle"
              style={{ fontSize: 10, fontWeight: 700, fill: changed ? "var(--accent)" : "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              {Math.round((Math.min(tempMinutes, 120) / 120) * 100)}%
            </text>
          </svg>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range" min="1" max="120"
        value={sliderVal}
        onChange={e => onChangeTempMinutes(Number(e.target.value))}
        style={{ width: "100%", display: "block", marginBottom: 8 }}
      />

      {/* Tick marks */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingInline: 2 }}>
        {ticks.map(t => (
          <span key={t} style={{ fontSize: 9, color: "var(--text-faint)", fontWeight: 500 }}>
            {t === 0 ? "" : `${t}`}
          </span>
        ))}
      </div>

      {/* Replan button — only appears when time changed AND plan exists */}
      {changed && (
        <button
          type="button"
          onClick={() => onTriggerReplan(tempMinutes)}
          disabled={isLoading}
          className="anim-fade-up btn btn-accent"
          style={{
            width: "100%", marginTop: 16, padding: "11px 16px", fontSize: 13,
            fontFamily: "inherit",
            opacity: isLoading ? 0.5 : 1, cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1.5 6.5C1.5 3.74 3.74 1.5 6.5 1.5C8.24 1.5 9.77 2.37 10.69 3.69M11.5 6.5C11.5 9.26 9.26 11.5 6.5 11.5C4.76 11.5 3.23 10.63 2.31 9.31"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10.5 1.5V4.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Replan for {tempMinutes} min
        </button>
      )}
    </div>
  );
}
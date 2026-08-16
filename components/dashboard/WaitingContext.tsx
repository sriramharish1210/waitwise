"use client";

import React from "react";

interface WaitingContextProps {
  situation: string;
  onChangeSituation: (v: string) => void;
}

export default function WaitingContext({ situation, onChangeSituation }: WaitingContextProps) {
  return (
    <div className="glass" style={{ padding: "20px 22px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5C4.56 1.5 3 3.06 3 5C3 7.5 6.5 11.5 6.5 11.5C6.5 11.5 10 7.5 10 5C10 3.06 8.44 1.5 6.5 1.5Z"
              stroke="var(--accent)" strokeWidth="1.2" fill="none"/>
            <circle cx="6.5" cy="5" r="1.2" fill="var(--accent)"/>
          </svg>
          <span className="label-micro">Waiting context</span>
        </div>
        {/* Agent ready */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "var(--success)", background: "var(--success-dim)",
          border: "1px solid rgba(62,207,160,0.18)", borderRadius: 100, padding: "3px 9px",
        }}>
          <span className="anim-pulse-dot" style={{
            width: 4, height: 4, borderRadius: "50%", background: "var(--success)", display: "block",
          }} />
          Agent ready
        </div>
      </div>

      <input
        type="text"
        value={situation}
        onChange={e => onChangeSituation(e.target.value)}
        placeholder="e.g., College administration office"
        className="glass-input"
        style={{ width: "100%", padding: "11px 14px", fontSize: 14 }}
      />
    </div>
  );
}
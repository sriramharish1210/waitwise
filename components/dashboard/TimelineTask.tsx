"use client";

import React, { useState } from "react";

interface Props {
  name: string;
  duration: number;
  startMinute: number;
  endMinute: number;
  priority?: "high"|"medium"|"low";
  widthPercent: number;
  isBuffer?: boolean;
  isUnused?: boolean;
  reason?: string;
  index?: number;
}

const THEME = {
  high:   { bg: "rgba(240,112,106,0.10)", border: "rgba(240,112,106,0.28)", color: "#F0706A", glow: "rgba(240,112,106,0.15)" },
  medium: { bg: "rgba(240,168,74,0.08)",  border: "rgba(240,168,74,0.25)",  color: "#F0A84A", glow: "rgba(240,168,74,0.12)" },
  low:    { bg: "rgba(74,82,104,0.12)",   border: "rgba(74,82,104,0.22)",   color: "#6B7A96", glow: "rgba(74,82,104,0.10)" },
};

export default function TimelineTask({
  name, duration, startMinute, endMinute, priority,
  widthPercent, isBuffer = false, isUnused = false, reason, index = 0,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const isTiny = widthPercent < 10;

  const theme = isBuffer
    ? { bg: "rgba(122,107,154,0.12)", border: "rgba(122,107,154,0.28)", color: "#7A6B9A", glow: "rgba(122,107,154,0.12)", dashed: true }
    : isUnused
    ? { bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.07)", color: "#2D3748", glow: "none", dashed: true }
    : { ...(THEME[priority || "low"]), dashed: false };

  return (
    <div
      style={{ position: "relative", width: `${widthPercent}%`, height: "100%", flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "100%", height: "100%",
          background: theme.bg,
          border: `1px ${(theme as any).dashed ? "dashed" : "solid"} ${theme.border}`,
          borderRadius: 10,
          padding: isTiny ? 0 : "10px 12px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          overflow: "hidden",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered && !isUnused
            ? `0 4px 20px ${theme.glow}, 0 0 0 1px ${theme.border}`
            : "none",
          cursor: isUnused ? "default" : "pointer",
          animationDelay: `${index * 60}ms`,
        }}
      >
        {!isTiny && (
          <>
            <span style={{
              display: "block", fontSize: 11, fontWeight: 600, color: theme.color,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              lineHeight: 1.2, marginBottom: 4,
            }}>
              {name}
            </span>
            <span style={{ fontSize: 10, color: isUnused ? "var(--text-faint)" : theme.color, opacity: 0.7, fontWeight: 500 }}>
              {duration}m
            </span>
          </>
        )}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="anim-fade-in"
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            left: "50%", transform: "translateX(-50%)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 12, padding: "12px 14px",
            minWidth: 160, maxWidth: 220,
            zIndex: 50,
            boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            pointerEvents: "none",
            backdropFilter: "blur(20px)",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.1px" }}>
            {name}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: priority ? 4 : 0 }}>
            {startMinute}m – {endMinute}m &middot; {duration} min
          </p>
          {!isUnused && !isBuffer && priority && (
            <p style={{ fontSize: 10, fontWeight: 700, color: theme.color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: reason ? 6 : 0 }}>
              {priority} priority
            </p>
          )}
          {reason && (
            <p style={{
              fontSize: 10, color: "var(--text-muted)", lineHeight: 1.55,
              borderTop: "1px solid var(--border-subtle)", paddingTop: 6, marginTop: 2,
            }}>
              {reason}
            </p>
          )}
          {/* Tooltip arrow */}
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
            width: 8, height: 8,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderTop: "none", borderLeft: "none",
          }} />
        </div>
      )}
    </div>
  );
}
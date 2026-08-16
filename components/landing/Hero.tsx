"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Staggered entrance: image → headline → sub → cta
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 480);
    const t3 = setTimeout(() => setPhase(3), 720);
    const t4 = setTimeout(() => setPhase(4), 940);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--bg-void)",
      }}
    >
      {/* ── Artwork layer ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      >
        <Image
          src="/assets/images/hero.png"
          alt="City scene with people waiting and working"
          fill
          priority
          quality={90}
          style={{
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
        {/* Vignette to fade edges into dark bg — preserves illustration depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(
                ellipse 55% 60% at 50% 50%,
                transparent 0%,
                transparent 30%,
                rgba(5,7,12,0.30) 65%,
                rgba(5,7,12,0.80) 85%,
                rgba(5,7,12,0.97) 100%
              )
            `,
          }}
        />
        {/* Top darken so navbar stays readable */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: "12%",
            background: "linear-gradient(to bottom, rgba(5,7,12,0.7), transparent)",
          }}
        />
        {/* Bottom darken so it flows into dashboard */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0, height: "18%",
            background: "linear-gradient(to top, rgba(5,7,12,0.98), transparent)",
          }}
        />
      </div>

      {/* ── Central typography zone ────────────────────────── */}
      {/* Positioned in the center void of the artwork */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 520,
          // Nudge slightly up to sit in the illustration's center void
          marginTop: "-6vh",
        }}
      >
        {/* Status pill */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--success)",
              background: "rgba(62,207,160,0.08)",
              border: "1px solid rgba(62,207,160,0.20)",
              borderRadius: 100,
              padding: "6px 14px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="anim-pulse-dot" style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--success)", display: "block", flexShrink: 0,
            }} />
            Agent ready
          </div>
        </div>

        {/* Display headline — large, bold, in the void */}
        <h1
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s",
            fontSize: "clamp(44px, 8vw, 80px)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            marginBottom: 20,
            textShadow: "0 2px 40px rgba(5,7,12,0.8)",
          }}
        >
          MAKE
          <br />
          <span style={{ color: "var(--accent-bright)" }}>EVERY</span>
          <br />
          MINUTE
          <br />
          COUNT.
        </h1>

        {/* Sub */}
        <p
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            fontSize: "clamp(13px, 2vw, 16px)",
            fontWeight: 400,
            color: "rgba(232,236,244,0.70)",
            lineHeight: 1.65,
            maxWidth: 360,
            marginBottom: 36,
            textShadow: "0 1px 12px rgba(5,7,12,0.9)",
          }}
        >
          Turn unpredictable waiting time into useful time.
          <br />
          AI schedules your window. You execute the plan.
        </p>

        {/* CTA */}
        <div
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
            transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={onStart}
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.01em",
              padding: "14px 32px",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            Start a waiting session
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Feature tags below CTA */}
        <div
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transition: "opacity 0.5s ease 0.2s",
            display: "flex",
            gap: 20,
            marginTop: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["AI scheduling", "Live replanning", "Safety buffer", "Agent insight"].map((f) => (
            <span key={f} style={{
              fontSize: 10,
              fontWeight: 500,
              color: "rgba(139,149,170,0.7)",
              letterSpacing: "0.04em",
              textShadow: "0 1px 8px rgba(5,7,12,0.9)",
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          opacity: phase >= 4 ? 0.5 : 0,
          transition: "opacity 0.6s ease 0.5s",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
        }}
        onClick={onStart}
      >
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
          Get started
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="anim-float">
          <path d="M4 6L8 10L12 6" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
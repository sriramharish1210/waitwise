"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSession =
      localStorage.getItem("waitwise_plan") !== null ||
      localStorage.getItem("waitwise_tasks") !== null;
    if (hasSession) setShowDashboard(true);
  }, []);

  const handleReset = () => {
    ["waitwise_situation","waitwise_available_minutes","waitwise_tasks",
     "waitwise_plan","waitwise_previous_plan","waitwise_previous_minutes"]
      .forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-void)" }}>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: showDashboard ? "1px solid var(--border-faint)" : "1px solid transparent",
        background: showDashboard
          ? "rgba(5,7,12,0.88)"
          : "linear-gradient(to bottom, rgba(5,7,12,0.75), transparent)",
        backdropFilter: showDashboard ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto",
          padding: "0 28px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <button
            onClick={() => showDashboard && setShowDashboard(false)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", cursor: showDashboard ? "pointer" : "default",
              padding: 0,
            }}
            aria-label="WaitWise"
          >
            {/* W mark */}
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "var(--text-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              <span style={{
                fontSize: 13, fontWeight: 800, color: "var(--bg-void)",
                letterSpacing: "-0.8px", lineHeight: 1,
              }}>W</span>
            </div>
            <span style={{
              fontSize: 16, fontWeight: 700, letterSpacing: "-0.4px",
              color: "var(--text-primary)",
              textShadow: "0 1px 8px rgba(5,7,12,0.8)",
            }}>
              WaitWise
            </span>
          </button>

          {/* Right */}
          {mounted && showDashboard && (
            <button
              onClick={() => setShowNewSessionModal(true)}
              style={{
                fontSize: 12, fontWeight: 500,
                color: "var(--text-muted)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8, padding: "6px 14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              New Session
            </button>
          )}
        </div>
      </header>

      {/* ══════════════════ CONTENT ══════════════════ */}
      <main style={{ flex: 1 }}>
        {!mounted ? null : showDashboard ? (
          <Dashboard />
        ) : (
          <Hero onStart={() => setShowDashboard(true)} />
        )}
      </main>

      {/* ══════════════════ NEW SESSION MODAL ══════════════════ */}
      {showNewSessionModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(5,7,12,0.80)",
            backdropFilter: "blur(12px)",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowNewSessionModal(false); }}
        >
          <div
            className="anim-fade-up glass-elevated"
            style={{
              maxWidth: 380, width: "90%",
              padding: "32px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 12 }}>
              New session
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", color: "var(--text-primary)", marginBottom: 10 }}>
              Start a new session?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
              Your current tasks and plan will be cleared. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowNewSessionModal(false)}>
                Keep session
              </button>
              <button
                className="btn btn-primary"
                onClick={handleReset}
                style={{ fontSize: 13, padding: "9px 18px" }}
              >
                Start new session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
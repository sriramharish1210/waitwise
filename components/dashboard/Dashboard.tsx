"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Task } from "@/types/task";
import { WaitPlan } from "@/types/plan";
import WaitingContext from "./WaitingContext";
import WaitingTimeControl from "./WaitingTimeControl";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import Timeline from "./Timeline";
import AgentInsight from "./AgentInsight";
import ReplanNotice from "./ReplanNotice";

const DEMO_TASKS: Task[] = [
  { id: "task-1", name: "Finish assignment",    duration: 20, priority: "high" },
  { id: "task-2", name: "Review presentation",  duration: 15, priority: "medium" },
  { id: "task-3", name: "Reply to emails",      duration: 5,  priority: "low" },
];

/* ── Temporal Loader ──────────────────────────────────────────── */
function TemporalLoader({ prevMin, nextMin, message }: {
  prevMin?: number; nextMin?: number; message: string;
}) {
  const isReplan = prevMin !== undefined && nextMin !== undefined && prevMin !== nextMin;
  const blocks = [
    { w: 40, color: "var(--p-high)", bg: "var(--p-high-dim)", delay: 0 },
    { w: 22, color: "var(--p-med)",  bg: "var(--p-med-dim)",  delay: 180 },
    { w: 16, color: "var(--accent)", bg: "var(--accent-dim)", delay: 320 },
    { w: 14, color: "var(--buffer)", bg: "var(--buffer-dim)", delay: 480 },
    { w: 8,  color: "var(--text-faint)", bg: "rgba(36,42,56,0.4)", delay: 600 },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 360, padding: "48px 32px", textAlign: "center",
    }}>

      {/* Animated timeline blocks */}
      <div style={{
        width: "100%", maxWidth: 360, height: 48,
        display: "flex", gap: 4, marginBottom: 32,
        position: "relative", overflow: "hidden", borderRadius: 10,
      }}>
        {/* Scan line */}
        <div className="anim-scan" style={{
          position: "absolute", top: 0, bottom: 0, width: "25%",
          background: "linear-gradient(90deg,transparent,rgba(99,149,255,0.18),transparent)",
          zIndex: 3, pointerEvents: "none",
        }} />
        {blocks.map((b, i) => (
          <div
            key={i}
            className="anim-block"
            style={{
              width: `${b.w}%`, height: "100%",
              background: b.bg,
              border: `1px solid ${b.color}33`,
              borderRadius: 8,
              animationDelay: `${b.delay}ms`,
              position: "relative",
            }}
          />
        ))}
      </div>

      {/* Time transition */}
      {isReplan && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{
            fontSize: 22, fontWeight: 800, letterSpacing: "-0.05em",
            color: "var(--text-muted)", textDecoration: "line-through", opacity: 0.5,
          }}>{prevMin}m</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M11 5L16 10L11 15"
              stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontSize: 22, fontWeight: 800, letterSpacing: "-0.05em", color: "var(--accent-bright)",
          }}>{nextMin}m</span>
        </div>
      )}

      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "-0.1px" }}>
        {message}
      </p>
      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
        WaitWise agent is reallocating your time window
      </p>
    </div>
  );
}

/* ── CTA Section ──────────────────────────────────────────────── */
function OptimizeCTA({ onOptimize, disabled }: { onOptimize: () => void; disabled: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 280, padding: "48px 32px", textAlign: "center",
    }}>
      {/* Clock visual */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--accent-dim)",
        border: "1px solid var(--accent-border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }} className="anim-glow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeWidth="1.4"/>
          <path d="M12 7V12.5L15.5 15.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>

      <h3 style={{
        fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px",
        color: "var(--text-primary)", marginBottom: 8,
      }}>
        Your time window is ready
      </h3>
      <p style={{
        fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65,
        maxWidth: 320, marginBottom: 28,
      }}>
        The agent will schedule your tasks, compute a dynamic safety buffer, and explain every decision.
      </p>

      <button
        onClick={onOptimize}
        disabled={disabled}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          fontSize: 14, fontWeight: 700, letterSpacing: "0.02em",
          color: disabled ? "var(--text-faint)" : "var(--bg-void)",
          background: disabled ? "rgba(255,255,255,0.04)" : "var(--text-primary)",
          border: disabled ? "1px solid var(--border-subtle)" : "none",
          borderRadius: 12, padding: "14px 32px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          transition: "all 0.2s ease",
          fontFamily: "inherit",
          boxShadow: disabled ? "none" : "0 4px 20px rgba(232,236,244,0.12)",
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
        onMouseLeave={e => { e.currentTarget.style.opacity = disabled ? "0.4" : "1"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L13 8L6 13V3Z" fill="currentColor"/>
        </svg>
        TURN THIS WAIT INTO PROGRESS
      </button>

      {disabled && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
          Add at least one task to begin
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [situation, setSituation]       = useState("College administration office");
  const [activeMinutes, setActiveMin]   = useState(35);
  const [tempMinutes, setTempMin]       = useState(35);
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [plan, setPlan]                 = useState<WaitPlan | null>(null);
  const [previousPlan, setPreviousPlan] = useState<WaitPlan | null>(null);
  const [previousMinutes, setPrevMin]   = useState(35);
  const [showReplanNotice, setShowReplanNotice] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [loadingMsg, setLoadingMsg]     = useState("");
  const [replanTarget, setReplanTarget] = useState<number | undefined>(undefined);
  const [error, setError]               = useState<string | null>(null);
  const [newPlanReady, setNewPlanReady] = useState(false);

  // Auto-scroll ref — points to the output section
  const outputRef = useRef<HTMLDivElement>(null);

  /* ── localStorage hydration ─────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    const s  = localStorage.getItem("waitwise_situation");
    const m  = localStorage.getItem("waitwise_available_minutes");
    const t  = localStorage.getItem("waitwise_tasks");
    const p  = localStorage.getItem("waitwise_plan");
    const pp = localStorage.getItem("waitwise_previous_plan");
    const pm = localStorage.getItem("waitwise_previous_minutes");

    if (s)  setSituation(s);
    if (m)  { const n = Number(m); setActiveMin(n); setTempMin(n); }
    if (t)  setTasks(JSON.parse(t));
    else    setTasks(DEMO_TASKS);
    if (p)  setPlan(JSON.parse(p));
    if (pp) setPreviousPlan(JSON.parse(pp));
    if (pm) setPrevMin(Number(pm));
  }, []);

  /* ── localStorage persistence ───────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("waitwise_situation", situation);
    localStorage.setItem("waitwise_available_minutes", activeMinutes.toString());
    localStorage.setItem("waitwise_tasks", JSON.stringify(tasks));
    if (plan)         localStorage.setItem("waitwise_plan", JSON.stringify(plan));
    else              localStorage.removeItem("waitwise_plan");
    if (previousPlan) {
      localStorage.setItem("waitwise_previous_plan", JSON.stringify(previousPlan));
      localStorage.setItem("waitwise_previous_minutes", previousMinutes.toString());
    } else {
      localStorage.removeItem("waitwise_previous_plan");
      localStorage.removeItem("waitwise_previous_minutes");
    }
  }, [mounted, situation, activeMinutes, tasks, plan, previousPlan, previousMinutes]);

  /* ── Auto-scroll: fires ONLY after plan is ready & rendered ─ */
  useEffect(() => {
    if (!newPlanReady || !outputRef.current) return;
    // requestAnimationFrame ensures DOM has painted the output before scrolling
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setNewPlanReady(false);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [newPlanReady, plan]);

  /* ── Task handlers ──────────────────────────────────────── */
  const handleAddTask = useCallback((t: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { id: `task-${Date.now()}`, ...t }]);
  }, []);
  const handleUpdateTask = useCallback((updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  }, []);
  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── Optimize ───────────────────────────────────────────── */
  const handleOptimize = async () => {
    if (!tasks.length) { setError("Add at least one task first."); return; }
    setIsLoading(true); setLoadingMsg("Analyzing your tasks..."); setError(null);
    setShowReplanNotice(false); setReplanTarget(undefined);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, availableMinutes: activeMinutes, tasks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Optimization failed.");
      setPlan(data);
      setPreviousPlan(null);
      setNewPlanReady(true); // ← triggers auto-scroll after render
    } catch (e: any) {
      setError(e.message || "Failed to contact agent.");
    } finally {
      setIsLoading(false); setLoadingMsg(""); setReplanTarget(undefined);
    }
  };

  /* ── Replan ─────────────────────────────────────────────── */
  const handleReplan = async (newTime: number) => {
    if (!plan) return;
    setIsLoading(true); setLoadingMsg("Reallocating your time..."); setError(null);
    setReplanTarget(newTime);
    setPreviousPlan(plan); setPrevMin(activeMinutes);
    try {
      const res = await fetch("/api/replan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, newMinutes: newTime, tasks, previousPlan: plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Replan failed.");
      setPlan(data);
      setActiveMin(newTime); setTempMin(newTime);
      setShowReplanNotice(true);
      setNewPlanReady(true); // ← auto-scroll after replan
    } catch (e: any) {
      setError(e.message || "Failed to reoptimize.");
    } finally {
      setIsLoading(false); setLoadingMsg(""); setReplanTarget(undefined);
    }
  };

  /* ── Undo ───────────────────────────────────────────────── */
  const handleUndo = () => {
    if (!previousPlan) return;
    setPlan(previousPlan); setActiveMin(previousMinutes); setTempMin(previousMinutes);
    setPreviousPlan(null); setShowReplanNotice(false); setError(null);
  };

  if (!mounted) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "60vh", color: "var(--text-muted)", fontSize: 13 }}>
      Loading session...
    </div>
  );

  const isOptimized = !isLoading && plan !== null;

  return (
    <div style={{
      paddingTop: 56, // offset for fixed navbar
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse 80% 50% at 20% 20%, rgba(99,149,255,0.04) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 70%, rgba(62,207,160,0.03) 0%, transparent 55%),
        var(--bg-void)
      `,
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* ── Error banner ──────────────────────────── */}
        {error && (
          <div className="anim-fade-up" style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--danger-dim)", border: "1px solid rgba(240,112,106,0.2)",
            borderRadius: 12, padding: "12px 16px", marginBottom: 24,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="6" stroke="var(--danger)" strokeWidth="1.2"/>
              <path d="M7 4.5V7.5M7 9.5H7.01" stroke="var(--danger)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>{error}</span>
            <button onClick={() => setError(null)} style={{
              background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TWO-COLUMN PLANNING AREA
            Left: Tasks | Right: WC + Time + Add Task
        ══════════════════════════════════════════════ */}
        <div className="plan-grid" style={{ display: "grid", gap: 20, marginBottom: 20 }}>

          {/* ── LEFT: Task management ─────────────────── */}
          <div className="plan-left glass" style={{ padding: "24px" }}>
            <div style={{ marginBottom: 20 }}>
              <p className="label-micro" style={{ marginBottom: 4 }}>Your tasks</p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <h2 style={{
                  fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", color: "var(--text-primary)",
                }}>
                  What do you need to do?
                </h2>
                {tasks.length > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "var(--accent)",
                    background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                    borderRadius: 100, padding: "2px 9px",
                  }}>
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            <TaskList
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* ── RIGHT: Controls ───────────────────────── */}
          <div className="plan-right" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Waiting Context */}
            <WaitingContext
              situation={situation}
              onChangeSituation={setSituation}
            />

            {/* Available Time */}
            <WaitingTimeControl
              activeMinutes={activeMinutes}
              tempMinutes={tempMinutes}
              onChangeTempMinutes={setTempMin}
              onTriggerReplan={handleReplan}
              hasPlan={plan !== null}
              isLoading={isLoading}
            />

            {/* Add Task */}
            <TaskInput situation={situation} onAddTask={handleAddTask} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            FULL-WIDTH OUTPUT SECTION
        ══════════════════════════════════════════════ */}
        <div ref={outputRef} style={{ scrollMarginTop: 72 }}>

          {/* Loading */}
          {isLoading ? (
            <div className="glass" style={{ padding: "0" }}>
              <TemporalLoader
                prevMin={replanTarget !== undefined ? activeMinutes : undefined}
                nextMin={replanTarget}
                message={loadingMsg}
              />
            </div>
          ) : !plan ? (
            /* CTA — no plan yet */
            <div className="glass" style={{ padding: 0 }}>
              <OptimizeCTA onOptimize={handleOptimize} disabled={tasks.length === 0} />
            </div>
          ) : (
            /* Plan output */
            <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Replan notice */}
              {showReplanNotice && (
                <ReplanNotice
                  visible={showReplanNotice}
                  previousMinutes={previousMinutes}
                  currentMinutes={activeMinutes}
                  onUndo={handleUndo}
                  onClose={() => setShowReplanNotice(false)}
                />
              )}

              {/* Re-optimize bar (if plan exists and user changed time) */}
              {tempMinutes !== activeMinutes && plan && !isLoading && (
                <div className="anim-slide-right glass" style={{
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 16, borderColor: "var(--accent-border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1.5 7C1.5 3.96 3.96 1.5 7 1.5C8.85 1.5 10.5 2.44 11.46 3.87M12.5 7C12.5 10.04 10.04 12.5 7 12.5C5.15 12.5 3.5 11.56 2.54 10.13"
                        stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M11.5 1.5V4.5H8.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      Time window changed to{" "}
                      <strong style={{ color: "var(--accent-bright)" }}>{tempMinutes} min</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => handleReplan(tempMinutes)}
                    className="btn btn-accent"
                    style={{ fontSize: 12, padding: "8px 16px", fontFamily: "inherit" }}
                  >
                    Replan
                  </button>
                </div>
              )}

              {/* Timeline */}
              <Timeline plan={plan} availableMinutes={activeMinutes} />

              {/* Agent Insight */}
              <AgentInsight plan={plan} />

              {/* Re-optimize from output */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
                <button
                  onClick={handleOptimize}
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: "9px 20px", fontFamily: "inherit" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6C1 3.24 3.24 1 6 1C7.65 1 9.12 1.8 10.04 3.04M11 6C11 8.76 8.76 11 6 11C4.35 11 2.88 10.2 1.96 8.96"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M10 1V4H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Regenerate plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Responsive grid ── */}
      <style>{`
        .plan-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 960px) {
          .plan-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
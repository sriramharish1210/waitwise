import { NextResponse } from "next/server";
import { WaitWiseAgent } from "@/lib/ai/agent";
import { validateWaitPlan } from "@/lib/optimizer/planner";
import { Task } from "@/types/task";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { situation, availableMinutes, tasks } = body;

    // Validation
    if (!situation || typeof situation !== "string" || situation.trim() === "") {
      return NextResponse.json(
        { error: "Waiting context location is required." },
        { status: 400 }
      );
    }

    const parsedMinutes = Number(availableMinutes);
    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      return NextResponse.json(
        { error: "Available waiting time must be a positive number of minutes." },
        { status: 400 }
      );
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "You must provide at least one task to generate an optimized schedule." },
        { status: 400 }
      );
    }

    // Call single WaitWiseAgent
    const plan = await WaitWiseAgent.optimizeTimeline(
      situation.trim(),
      parsedMinutes,
      tasks as Task[]
    );

    // Apply deterministic validation checks
    const validation = validateWaitPlan(plan, tasks as Task[], parsedMinutes);
    if (!validation.isValid) {
      console.error("Deterministic validation failed on AI generated plan:", validation.errors);
      return NextResponse.json(
        {
          error: "AI-generated plan failed structural validation rules.",
          details: validation.errors
        },
        { status: 422 }
      );
    }

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("API Optimize Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during schedule optimization." },
      { status: 500 }
    );
  }
}

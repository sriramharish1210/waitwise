import { NextResponse } from "next/server";
import { WaitWiseAgent } from "@/lib/ai/agent";
import { validateWaitPlan } from "@/lib/optimizer/planner";
import { Task } from "@/types/task";
import { WaitPlan } from "@/types/plan";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { situation, newMinutes, tasks, previousPlan } = body;

    // Validation
    if (!situation || typeof situation !== "string" || situation.trim() === "") {
      return NextResponse.json(
        { error: "Waiting context location is required." },
        { status: 400 }
      );
    }

    const parsedMinutes = Number(newMinutes);
    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      return NextResponse.json(
        { error: "New available waiting time must be a positive number." },
        { status: 400 }
      );
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "Task list is empty; cannot replan." },
        { status: 400 }
      );
    }

    if (!previousPlan || typeof previousPlan !== "object") {
      return NextResponse.json(
        { error: "Previous plan configuration is required to compute recalculations." },
        { status: 400 }
      );
    }

    // Call single WaitWiseAgent replan capability
    const newPlan = await WaitWiseAgent.replanTimeline(
      situation.trim(),
      parsedMinutes,
      tasks as Task[],
      previousPlan as WaitPlan
    );

    // Apply deterministic validation checks
    const validation = validateWaitPlan(newPlan, tasks as Task[], parsedMinutes);
    if (!validation.isValid) {
      console.error("Deterministic validation failed on AI replanned plan:", validation.errors);
      return NextResponse.json(
        {
          error: "AI-recalculated plan failed structural validation rules.",
          details: validation.errors
        },
        { status: 422 }
      );
    }

    return NextResponse.json(newPlan);
  } catch (error: any) {
    console.error("API Replan Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during dynamic replanning." },
      { status: 500 }
    );
  }
}

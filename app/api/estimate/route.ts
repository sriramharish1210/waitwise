import { NextResponse } from "next/server";
import { WaitWiseAgent } from "@/lib/ai/agent";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { situation, taskName } = body;

    if (!situation || typeof situation !== "string" || situation.trim() === "") {
      return NextResponse.json(
        { error: "Waiting situation context is required." },
        { status: 400 }
      );
    }

    if (!taskName || typeof taskName !== "string" || taskName.trim() === "") {
      return NextResponse.json(
        { error: "Task description is required to perform duration estimation." },
        { status: 400 }
      );
    }

    const estimation = await WaitWiseAgent.estimateTaskDuration(situation.trim(), taskName.trim());
    return NextResponse.json(estimation);
  } catch (error: any) {
    console.error("API Estimate Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during duration estimation." },
      { status: 500 }
    );
  }
}

import { getGeminiClient } from "./gemini";
import { 
  geminiDurationEstimationSchema, 
  geminiWaitPlanSchema, 
  DurationEstimationSchema, 
  WaitPlanSchema 
} from "./schemas";
import { 
  ESTIMATE_DURATION_SYSTEM, 
  OPTIMIZE_TIMELINE_SYSTEM, 
  REPLAN_TIMELINE_SYSTEM 
} from "./prompts";
import { Task } from "@/types/task";
import { WaitPlan } from "@/types/plan";

export const WaitWiseAgent = {
  /**
   * Estimates realistic task duration in minutes.
   */
  async estimateTaskDuration(situation: string, taskName: string) {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiDurationEstimationSchema,
      },
      systemInstruction: ESTIMATE_DURATION_SYSTEM,
    });

    const prompt = `Waiting Context: "${situation}"\nTask description to estimate: "${taskName}"`;
    
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) {
        throw new Error("Gemini returned an empty response during duration estimation.");
      }
      
      const parsed = JSON.parse(text.trim());
      const validationResult = DurationEstimationSchema.safeParse(parsed);
      if (!validationResult.success) {
        throw new Error(`AI response structure mismatch: ${validationResult.error.message}`);
      }
      
      return validationResult.data;
    } catch (err: any) {
      console.error("Error in estimateTaskDuration agent call:", err);
      throw new Error(err.message || "Failed to estimate task duration via Gemini.");
    }
  },

  /**
   * Creates the initial schedule of tasks based on available time.
   */
  async optimizeTimeline(situation: string, availableMinutes: number, tasks: Task[]): Promise<WaitPlan> {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiWaitPlanSchema,
      },
      systemInstruction: OPTIMIZE_TIMELINE_SYSTEM,
    });

    const prompt = `Waiting Situation Context: "${situation}"
Available Minutes: ${availableMinutes}
Tasks: ${JSON.stringify(tasks, null, 2)}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) {
        throw new Error("Gemini returned an empty response during plan optimization.");
      }

      const parsed = JSON.parse(text.trim());
      const validationResult = WaitPlanSchema.safeParse(parsed);
      if (!validationResult.success) {
        throw new Error(`AI plan structure mismatch: ${validationResult.error.message}`);
      }

      return validationResult.data;
    } catch (err: any) {
      console.error("Error in optimizeTimeline agent call:", err);
      throw new Error(err.message || "Failed to generate optimized schedule via Gemini.");
    }
  },

  /**
   * Recalculates the schedule when waiting time constraint changes.
   */
  async replanTimeline(situation: string, newMinutes: number, tasks: Task[], previousPlan: WaitPlan): Promise<WaitPlan> {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiWaitPlanSchema,
      },
      systemInstruction: REPLAN_TIMELINE_SYSTEM,
    });

    const prompt = `Waiting Situation Context: "${situation}"
New Available Time Constraint: ${newMinutes} minutes

Original Tasks:
${JSON.stringify(tasks, null, 2)}

Previous Wait Plan:
${JSON.stringify(previousPlan, null, 2)}`;

    try {
      const startTime = Date.now();

      console.log("WAITWISE: Gemini replan request started");

      const result = await model.generateContent(prompt);

    console.log(
    `WAITWISE: Gemini replan response received in ${
    (Date.now() - startTime) / 1000
    } seconds`
    );
      const text = result.response.text();
      if (!text) {
        throw new Error("Gemini returned an empty response during plan replanning.");
      }

      const parsed = JSON.parse(text.trim());
      const validationResult = WaitPlanSchema.safeParse(parsed);
      if (!validationResult.success) {
        throw new Error(`AI plan structure mismatch during replanning: ${validationResult.error.message}`);
      }

      return validationResult.data;
    } catch (err: any) {
      console.error("Error in replanTimeline agent call:", err);
      throw new Error(err.message || "Failed to recalculate plan via Gemini.");
    }
  }
};

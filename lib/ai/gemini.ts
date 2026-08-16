import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your .env.local file.");
  }
  return new GoogleGenerativeAI(apiKey);
}

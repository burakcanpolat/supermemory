import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Env } from "./types";

export function openai(
  env: Env,
  apiKey?: string
): ReturnType<typeof createOpenAI> {
  console.log(">>> Checking OPENAI_API_KEY in provider:", env.OPENAI_API_KEY ? "Exists" : "MISSING or undefined");
  return createOpenAI({
    apiKey: apiKey || env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1"
  });
}

export function google(securityKey: string) {
  return createGoogleGenerativeAI({
    apiKey: securityKey,
  });
}

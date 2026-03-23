import { getConfig } from "@/lib/config";
import { decryptString } from "@/lib/encrypt";
import type { AiProvider } from "./types";

export type { AiProvider };

export async function getAiProvider(): Promise<AiProvider | null> {
  const config = await getConfig();
  const { provider, model } = config.ai;
  const apiKey = decryptString(config.ai.apiKey);
  if (!provider || !apiKey) return null;

  if (provider === "anthropic") {
    const { AnthropicProvider } = await import("./anthropic");
    return new AnthropicProvider(apiKey, model);
  }
  if (provider === "openai") {
    const { OpenAiProvider } = await import("./openai");
    return new OpenAiProvider(apiKey, model);
  }
  if (provider === "gemini") {
    const { GeminiProvider } = await import("./gemini");
    return new GeminiProvider(apiKey, model);
  }
  return null;
}

export async function isAiConfigured(): Promise<boolean> {
  const config = await getConfig();
  return !!(config.ai.provider && config.ai.apiKey);
}

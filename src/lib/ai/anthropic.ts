import type { AiProvider } from "./types";

export class AnthropicProvider implements AiProvider {
  constructor(private apiKey: string, private model: string) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const model = this.model || "claude-sonnet-4-6";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  async describeImage(base64: string, mimeType: string, context?: string): Promise<string> {
    const model = this.model || "claude-sonnet-4-6";
    const prompt = context
      ? `Write alt text for this image used in an article titled "${context}". One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`
      : `Write alt text for this image. One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 100,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }
}

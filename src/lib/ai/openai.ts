import type { AiProvider } from "./types";

export class OpenAiProvider implements AiProvider {
  constructor(private apiKey: string, private model: string) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const model = this.model || "gpt-4o";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  async describeImage(base64: string, mimeType: string, context?: string): Promise<string> {
    const model = this.model || "gpt-4o";
    const prompt = context
      ? `Write alt text for this image used in an article titled "${context}". One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`
      : `Write alt text for this image. One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: 100,
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

import type { AiProvider } from "./types";

export class GeminiProvider implements AiProvider {
  constructor(private apiKey: string, private model: string) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const model = this.model || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 2048 },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  async describeImage(base64: string, mimeType: string, context?: string): Promise<string> {
    const model = this.model || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const prompt = context
      ? `Write alt text for this image used in an article titled "${context}". One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`
      : `Write alt text for this image. One concise sentence, factual and descriptive. No quotes, no "image of" prefix.`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: prompt },
          ],
        }],
        generationConfig: { maxOutputTokens: 100 },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
}

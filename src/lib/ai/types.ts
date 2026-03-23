export interface AiProvider {
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
  describeImage?(base64: string, mimeType: string, context?: string): Promise<string>;
}


import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateBackground(prompt: string, theme: string): Promise<string | null> {
    try {
      // Enhanced prompt based on theme
      const enhancedPrompt = `High quality artistic poster background, ${theme} style, ${prompt}, vibrant colors, sharp detail, 4k resolution, without any text or watermarks.`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error generating background:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

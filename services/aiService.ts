
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async suggestReply(history: Message[], contactName: string): Promise<string> {
    const context = history.map(m => `${m.direction === 'INBOUND' ? contactName : 'Agent'}: ${m.text || '[Media]'}`).join('\n');
    
    const prompt = `
      You are an Arabic-speaking customer support agent for a professional company.
      Provide a helpful, polite, and concise reply in Arabic (Sudanese/Saudi/Standard suitable for business).
      
      Customer Name: ${contactName}
      Conversation History:
      ${context}
      
      Strict Guidelines:
      - Reply only in Arabic.
      - Be professional and empathetic.
      - If the customer has a problem, acknowledge it.
      - Do not make up facts about the company.
      - Keep it short for WhatsApp.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "عذراً، لم أستطع توليد اقتراح حالياً.";
    } catch (error) {
      console.error("AI Error:", error);
      return "حدث خطأ في معالجة طلب الذكاء الاصطناعي.";
    }
  }
}

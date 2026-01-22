
import { GoogleGenAI } from "@google/genai";
import { Message, AISettings, ComplaintStatus } from "../types";
import { store } from "./mockStore";

export class AIService {
  private ai: GoogleGenAI;
  private settings: AISettings;

  constructor(settings: AISettings) {
    this.settings = settings;
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * تحليل الرسالة الواردة للكشف عن الشكاوى وتوليد تحليل عميق
   */
  async analyzeComplaint(messageText: string, contactName: string): Promise<any> {
    const prompt = `
      بصفتك محلل خدمة عملاء ذكي، قم بتحليل الشكوى التالية المقدمة من العميل: ${contactName}
      نص الشكوى: "${messageText}"
      
      المطلوب مخرجات بصيغة JSON حصراً تتضمن:
      1. rootCause: السبب الجذري للمشكلة بلهجة مهنية.
      2. customerSentiment: تحليل شعور العميل (غاضب، محبط، عادي).
      3. suggestedSolutions: قائمة من 3 حلول منطقية ومقترحة للرد.
      
      تحدث باللغة العربية.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json'
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return { 
        rootCause: "تعذر التحليل التلقائي حالياً", 
        customerSentiment: "غير معروف", 
        suggestedSolutions: ["الاعتذار للعميل وبحث المشكلة يدوياً"] 
      };
    }
  }

  /**
   * Suggest a reply based on conversation history
   */
  async suggestReply(messages: Message[], contactName: string): Promise<string> {
    const history = messages.slice(-5).map(m => `${m.direction === 'INBOUND' ? 'العميل' : 'الموظف'}: ${m.text}`).join('\n');
    const prompt = `
      بصفتك مساعد خدمة عملاء ذكي لشركة "وكالة إبداع واحتراف للدعاية والإعلان"، اقترح رداً مناسباً للعميل "${contactName}" بناءً على المحادثة التالية:
      
      ${history}
      
      التعليمات:
      - الرد يجب أن يكون بلهجة خليجية مهنية وودودة.
      - الرد يجب أن يكون مختصراً ومباشراً.
      - لا تضف أي نصوص توضيحية قبل أو بعد الرد.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "نعتذر، لم أتمكن من اقتراح رد حالياً.";
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      return "عذراً، حدث خطأ في النظام الذكي.";
    }
  }

  /**
   * محاكاة سير العمل الذكي للشكاوى
   */
  async handleInboundWorkflow(message: Message, contact: any) {
    const text = message.text?.toLowerCase() || "";
    const keywords = ['شكوى', 'تأخير', 'مشكلة', 'لماذا', 'تأخرتم', 'سيء', 'انزعاج'];
    
    if (keywords.some(k => text.includes(k))) {
      // 1. إجراء التحليل التلقائي
      const analysis = await this.analyzeComplaint(text, contact.name);
      
      // 2. تسجيل الشكوى في النظام
      const complaint = store.addComplaint({
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        category: 'شكوى ذكية',
        summary: text,
        details: text,
        status: ComplaintStatus.PENDING,
        aiAnalysis: analysis
      });

      // 3. إرسال رد فوري للعميل مع رقم الشكوى
      const replyText = `أهلاً بك سيد ${contact.name}، نعتذر بشدة عن الإزعاج. لقد تم تسجيل شكواك برقم موحد: ${complaint.complaintNumber}. يقوم فريق الجودة حالياً بمراجعة الأمر وسنتواصل معك فوراً.`;
      
      // هنا يتم محاكاة الإرسال
      console.log(`[WhatsApp Outbound] To: ${contact.phone}, Msg: ${replyText}`);
      
      return complaint;
    }
    return null;
  }
}

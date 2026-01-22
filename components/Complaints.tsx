
import React, { useState, useEffect, useRef } from 'react';
import { Complaint, ComplaintStatus, Message } from '../types';
import { store } from '../services/mockStore';
import { GoogleGenAI } from "@google/genai";
import { WhatsAppGateway } from '../services/whatsappGateway';

const ComplaintStatCard = ({ label, value, color, icon }: any) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between flex-1 group hover:shadow-lg transition-all">
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
      {icon}
    </div>
  </div>
);

export const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(store.complaints);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fixed: Corrected property access to use whatsappConfig from store to resolve the compilation error
  const whatsapp = new WhatsAppGateway(store.whatsappConfig || {
    baseUrl: 'https://darcoom.com/wsender',
    appKey: '52a594b2-74e7-4449-a58f-cd95b9c1822a',
    authKey: '...',
    webhookSecret: ''
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeComplaint?.messages]);

  const handleAiAnalysis = async (complaint: Complaint) => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `حلل الشكوى: "${complaint.details}". أرجع JSON: rootCause, customerSentiment, suggestedSolutions (array).`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const analysis = JSON.parse(response.text || "{}");
      store.updateComplaint(complaint.id, { aiAnalysis: analysis });
      setComplaints([...store.complaints]);
      if (activeComplaint?.id === complaint.id) {
        setActiveComplaint({ ...activeComplaint, aiAnalysis: analysis });
      }
    } catch (error) {
      console.error("AI Analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeComplaint || !replyText.trim()) return;
    
    setIsSending(true);
    try {
      // إرسال حقيقي عبر الواتساب
      await whatsapp.sendMessage(activeComplaint.contactPhone, replyText);
      
      // تحديث المتجر المحلي
      store.addMessageToComplaint(activeComplaint.id, replyText, 'OUTBOUND');
      setComplaints([...store.complaints]);
      setActiveComplaint({ ...activeComplaint, messages: [...activeComplaint.messages, {
        id: Math.random().toString(),
        conversationId: activeComplaint.id,
        direction: 'OUTBOUND',
        type: 'text',
        text: replyText,
        status: 'sent',
        timestamp: new Date().toISOString()
      }]});
      setReplyText('');
    } catch (error) {
      alert("فشل إرسال الرسالة عبر بوابة الواتساب");
    } finally {
      setIsSending(false);
    }
  };

  const useSolution = (solution: string) => {
    setReplyText(solution);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1 text-right">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">نظام الشكاوي الذكي</h2>
          <p className="text-slate-400 font-medium text-lg">تحليل المشكلات والتواصل المباشر لحلها</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <ComplaintStatCard label="إجمالي الشكاوى" value={complaints.length} color="bg-slate-800" icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>} />
        <ComplaintStatCard label="بانتظار المراجعة" value={complaints.filter(c => c.status === ComplaintStatus.PENDING).length} color="bg-amber-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <ComplaintStatCard label="تم الحل" value={complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length} color="bg-emerald-500" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
        {/* Complaints Sidebar List */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h4 className="font-black text-slate-800">قائمة الشكاوى النشطة</h4>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {complaints.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveComplaint(c)}
                className={`w-full p-6 text-right transition-all hover:bg-slate-50 ${activeComplaint?.id === c.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-slate-400 font-mono">{c.complaintNumber}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${c.status === ComplaintStatus.PENDING ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {c.status === ComplaintStatus.PENDING ? 'نشطة' : 'تم الحل'}
                  </span>
                </div>
                <h5 className="font-black text-slate-800">{c.contactName}</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{c.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Complaint Chat & Management Center */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
          {activeComplaint ? (
            <>
              {/* Header */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                    {activeComplaint.contactName[0]}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800">{activeComplaint.contactName}</h4>
                    <p className="text-xs text-slate-400 font-mono">+{activeComplaint.contactPhone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAiAnalysis(activeComplaint)}
                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                    title="تحديث تحليل AI"
                  >
                    <svg className={`w-5 h-5 ${aiLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </button>
                  <button 
                    onClick={() => {
                      store.updateComplaint(activeComplaint.id, { status: ComplaintStatus.RESOLVED });
                      setComplaints([...store.complaints]);
                      setActiveComplaint({...activeComplaint, status: ComplaintStatus.RESOLVED});
                    }}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                  >
                    إغلاق الشكوى
                  </button>
                </div>
              </div>

              {/* Chat Timeline */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/20">
                {/* Initial Complaint Card */}
                <div className="p-8 bg-white border border-blue-100 rounded-[2rem] shadow-sm max-w-[90%] border-r-4 border-r-blue-600">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">تفاصيل الشكوى الأصلية</p>
                  <p className="text-slate-700 font-bold leading-relaxed italic">"{activeComplaint.details}"</p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-[10px] text-slate-400 font-black">
                    <span>{activeComplaint.category}</span>
                    <span>{new Date(activeComplaint.createdAt).toLocaleString('ar-SA')}</span>
                  </div>
                </div>

                {/* Messages History */}
                {activeComplaint.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-6 py-4 rounded-[1.5rem] shadow-sm ${
                      m.direction === 'OUTBOUND' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                      <span className={`text-[9px] mt-2 block font-black ${m.direction === 'OUTBOUND' ? 'text-slate-400' : 'text-slate-300'}`}>
                        {new Date(m.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interaction Panel (AI + Reply) */}
              <div className="p-8 bg-white border-t border-slate-100 space-y-6">
                {/* AI Suggestions Row */}
                {activeComplaint.aiAnalysis?.suggestedSolutions && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-emerald-600 px-2 uppercase tracking-widest">حلول ذكية مقترحة للرد:</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {activeComplaint.aiAnalysis.suggestedSolutions.map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => useSolution(s)}
                          className="whitespace-nowrap px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all shrink-0"
                        >
                          {s.length > 30 ? s.substring(0, 30) + '...' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب ردك للعميل ليتم إرساله عبر واتساب..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none min-h-[60px]"
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={isSending || !replyText.trim()}
                    className="p-5 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6 opacity-30">
              <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="font-black text-slate-400 text-xl">اختر شكوى من القائمة لبدء المعالجة والتواصل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

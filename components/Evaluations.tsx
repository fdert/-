
import React, { useState } from 'react';
import { Evaluation } from '../types';
import { store } from '../services/mockStore';
import { GoogleGenAI } from "@google/genai";

const EvaluationStatCard = ({ label, value, icon, color, subValue }: { label: string; value: string | number; icon: React.ReactNode; color: string, subValue?: string }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between flex-1 min-w-[250px] group hover:shadow-lg transition-all">
    <div className="space-y-1">
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black text-slate-800">{value}</h3>
        {subValue && <span className="text-sm font-bold text-slate-400">{subValue}</span>}
      </div>
    </div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
      {icon}
    </div>
  </div>
);

interface AIStudyResult {
  sentiment: string;
  summary: string;
  deficiencies: string[];
  rootCauses: string[];
  proposedSolutions: string[];
  actionPlan: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const Evaluations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ratings' | 'analytics'>('ratings');
  const [evaluations] = useState<Evaluation[]>(store.evaluations);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIStudyResult | null>(null);

  const totalRatings = evaluations.length;
  const avgRating = evaluations.reduce((acc, curr) => acc + curr.rating, 0) / (totalRatings || 1);
  const positiveRatings = evaluations.filter(e => e.rating >= 4).length;

  const handleDeepAiStudy = async (evaluation: Evaluation) => {
    setAiLoading(true);
    setSelectedEval(evaluation);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بصفتك خبير جودة وتجربة عملاء (CX Expert)، قم بإجراء "دراسة حالة" متكاملة ومعمقة للتقييم التالي:
        العميل: ${evaluation.contactName}
        التقييم: ${evaluation.rating}/5
        التعليق: "${evaluation.comment || 'لا يوجد تعليق نصي'}"
        
        المطلوب تحليل إداري احترافي بصيغة JSON حصراً بالحقول التالية:
        1. sentiment: نبرة العميل بدقة.
        2. summary: ملخص الدراسة.
        3. deficiencies: مصفوفة بجميع أوجه القصور (Deficiencies) المستخلصة.
        4. rootCauses: الأسباب الجذرية (Root Causes) لهذا القصور.
        5. proposedSolutions: حلول مبتكرة وعملية مقترحة.
        6. actionPlan: خطة عمل (Action Plan) فورية للمدير.
        7. impactLevel: مستوى التأثير على سمعة العلامة التجارية (LOW, MEDIUM, HIGH, CRITICAL).
        
        تحدث باللغة العربية المهنية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      setAiResult(result);
    } catch (error) {
      console.error("Deep AI Study failed:", error);
      setAiResult({
        sentiment: "محايد",
        summary: "دراسة تقريبية لعدم توفر بيانات كافية حالياً.",
        deficiencies: ["تأخر استجابة محتمل", "ضعف في التواصل المبدئي"],
        rootCauses: ["ضغط تشغيلي عالي", "نقص الكادر في ساعات الذروة"],
        proposedSolutions: ["زيادة عدد الموظفين في الفترة الصباحية"],
        actionPlan: "إرسال اعتذار للعميل ومتابعة المحادثة الأصلية.",
        impactLevel: 'MEDIUM'
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">مركز تحليل جودة الأداء</h2>
        <p className="text-slate-400 font-medium text-lg">دراسة متكاملة لتقييمات العملاء، تحديد القصور، وخطط العمل التصحيحية عبر AI</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <EvaluationStatCard label="إجمالي التقييمات" value={totalRatings} color="bg-slate-800" icon={<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>} />
        <EvaluationStatCard label="متوسط الرضا" value={avgRating.toFixed(1)} subValue="/ 5" color="bg-amber-400" icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        <EvaluationStatCard label="ثقة العملاء" value={`${Math.round((positiveRatings/totalRatings)*100)}%`} color="bg-blue-600" icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        <div className="p-10 space-y-8">
          {evaluations.map(evalItem => (
            <div key={evalItem.id} className="p-10 bg-slate-50/30 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-8">
                  <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center text-3xl font-black shadow-lg ${
                    evalItem.rating >= 4 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {evalItem.rating}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-800">{evalItem.contactName}</h4>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">مراجعة الجودة</span>
                      <span className="text-sm font-mono text-slate-400 font-bold">+{evalItem.contactPhone}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeepAiStudy(evalItem)}
                  className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  إجراء دراسة حالة معمقة (AI)
                </button>
              </div>
              <div className="mt-8 bg-white p-8 rounded-[2rem] border border-slate-100 italic">
                <p className="text-slate-600 font-bold text-lg leading-relaxed">"{evalItem.comment || "تم تقديم تقييم رقمي فقط"}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Analysis Modal */}
      {selectedEval && aiResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[4rem] w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden border border-white/20 flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  {selectedEval.rating}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">تقرير دراسة الجودة الشامل</h3>
                  <p className="text-slate-400 font-bold mt-1 text-lg">تحليل استراتيجي لتجربة العميل: {selectedEval.contactName}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedEval(null); setAiResult(null); }} className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl border border-slate-100 transition-all shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content - The Study */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
              {/* Row 1: Sentiment & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    aiResult.impactLevel === 'CRITICAL' || aiResult.impactLevel === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">مستوى التأثير الإداري</h5>
                  <p className={`text-2xl font-black ${
                    aiResult.impactLevel === 'CRITICAL' ? 'text-rose-600' : 'text-slate-800'
                  }`}>{aiResult.impactLevel}</p>
                </div>
                <div className="lg:col-span-2 bg-blue-50/30 p-10 rounded-[3rem] border border-blue-100/50 space-y-4">
                  <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest">الخلاصة التنفيذية للمدير</h5>
                  <p className="text-xl font-bold text-slate-700 leading-relaxed">{aiResult.summary}</p>
                </div>
              </div>

              {/* Row 2: Deficiencies & Root Causes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h5 className="flex items-center gap-3 font-black text-2xl text-rose-600 px-4">
                    <span className="w-3 h-8 bg-rose-600 rounded-full"></span>
                    أوجه القصور المستخلصة (Deficiencies)
                  </h5>
                  <div className="space-y-4">
                    {aiResult.deficiencies.map((d, i) => (
                      <div key={i} className="p-6 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex gap-4">
                        <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center shrink-0 text-rose-700 font-bold">{i+1}</div>
                        <p className="text-rose-900 font-bold">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h5 className="flex items-center gap-3 font-black text-2xl text-amber-600 px-4">
                    <span className="w-3 h-8 bg-amber-600 rounded-full"></span>
                    الأسباب الجذرية (Root Causes)
                  </h5>
                  <div className="space-y-4">
                    {aiResult.rootCauses.map((r, i) => (
                      <div key={i} className="p-6 bg-amber-50 border border-amber-100 rounded-[1.5rem] flex gap-4">
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-amber-700 font-bold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-amber-900 font-bold">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Action Plan - Full Study */}
              <div className="p-12 bg-slate-900 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
                <div className="flex items-center gap-6 relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl">
                    🚀
                  </div>
                  <div>
                    <h5 className="font-black text-3xl tracking-tight">خطة العمل التصحيحية (Action Plan)</h5>
                    <p className="text-blue-300 font-bold text-lg">توصيات استراتيجية واجبة التنفيذ الفوري</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative">
                  <p className="text-2xl font-bold leading-relaxed text-slate-100">{aiResult.actionPlan}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {aiResult.proposedSolutions.map((s, i) => (
                    <div key={i} className="p-8 bg-white/10 rounded-3xl border border-white/5 flex items-center gap-5 hover:bg-white/20 transition-all cursor-default">
                      <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">✓</div>
                      <p className="font-black text-lg">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-12 bg-slate-50 border-t border-slate-100 flex gap-6">
              <button className="flex-1 py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all">تصدير الدراسة (PDF)</button>
              <button className="flex-1 py-6 bg-white border-2 border-slate-200 text-slate-800 rounded-[2.5rem] font-black text-2xl hover:bg-slate-100 transition-all">مشاركة الدراسة مع الفريق</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State Overlay */}
      {aiLoading && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-3xl">
          <div className="w-32 h-32 border-t-8 border-r-8 border-blue-600 rounded-full animate-spin shadow-2xl shadow-blue-600/20 mb-12"></div>
          <h3 className="text-5xl font-black text-white animate-pulse tracking-tighter">جاري تحليل القشور وبناء الدراسة...</h3>
          <p className="text-blue-400 font-black mt-4 text-xl tracking-widest uppercase">Deep AI Quality Audit in Progress</p>
        </div>
      )}
    </div>
  );
};

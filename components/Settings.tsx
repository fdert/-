
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { WhatsAppConfig, AISettings, RoutingSettings, NotificationSettings, EvaluationSettings } from '../types';

export const Settings: React.FC = () => {
  const [waConfig, setWaConfig] = useState<WhatsAppConfig>({
    baseUrl: 'https://darcoom.com/wsender/public/api/create-message',
    appKey: '52a594b2-74e7-4449-a58f-cd95b9c1822a',
    authKey: '••••••••••••••••••••••••••••••••••••••••••••••••••',
    webhookSecret: 'shhh_secret',
  });

  const [routing, setRouting] = useState<RoutingSettings>({
    autoRouting: true,
    distributionMethod: 'random',
    notifyOnAssign: true,
    maxChatsPerEmployee: 30,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    aiAutoReply: true,
    notifyAdminOnDelay: true,
    adminPhone: '966535983261',
    delayThresholdMinutes: 10,
    delayTemplate: 'تنبيه: العميل {{customer_name}} ({{customer_phone}}) ينتظر الرد منذ {{wait_minutes}} دقيقة.\n\nرقم المحادثة: {{conversation_id}}',
    complaintTemplate: '[تنبيه شكوى جديدة]\n\nالعميل: {{customer_name}}\nرقم الجوال: {{customer_phone}}\nرقم المحادثة: {{conversation_id}}\n\nملخص الشكوى:\n{{summary}}\n\nالحلول المقترحة:\n{{solutions}}\n\nالوقت: {{timestamp}}\n\nيرجى المتابعة في أقرب وقت ممكن.',
    notificationApi: {
      baseUrl: 'https://darcoom.com/wsender/public/api/create-message',
      appKey: 'e2891802-8b61-43b7-872a-474976d3fb4f',
      authKey: '••••••••••••••••••••••••••••••••••••••••••••••••••',
      webhookSecret: '',
    }
  });

  const [evaluations, setEvaluations] = useState<EvaluationSettings>({
    enabled: true,
    waitHours: 1,
  });

  const [aiSettings, setAiSettings] = useState<AISettings>({
    enabled: true,
    activeProvider: 'gemini',
    activeModel: 'gemini-3-flash-preview',
    apiKeys: {
      gemini: 'AIzaSyD-••••••••••••••••••••••••',
      openai: 'sk-proj-••••••••••••••••••••••••',
      deepseek: 'sk-••••••••••••••••••••••••',
      groq: 'gsk_••••••••••••••••••••••••',
    },
    temperature: 0.7,
    maxTokens: 1500,
    systemPrompt: `أنت مساعد CRM ذكي تمثل "وكالة إبداع وااحتراف للدعاية والإعلان"...`,
    autoReply: true,
    handleOrders: true,
    handleRatings: true,
    handleComplaints: true,
  });

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="border-b border-slate-50 pb-6 mb-8 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const SaveInputRow = ({ label, value, type = "text", onChange }: any) => (
    <div className="space-y-1.5 flex-1">
      <label className="text-[12px] font-bold text-slate-500 block px-1">{label}</label>
      <div className="flex gap-2">
        <input 
          type={type} 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-left font-mono"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          حفظ
        </button>
      </div>
    </div>
  );

  const ToggleRow = ({ label, desc, checked, onChange }: any) => (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        <p className="text-[11px] text-slate-400">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      
      {/* 1. WhatsApp (wsender) Settings - Matched with screenshot */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <SectionHeader title="إعدادات WhatsApp (wsender)" subtitle="تعديل بيانات الربط مع بوابة واتساب الخارجية لنظام الإرسال" />
        <div className="space-y-6">
          <SaveInputRow 
            label="رابط API (Base URL)" 
            value={waConfig.baseUrl} 
            onChange={(v:string) => setWaConfig({...waConfig, baseUrl: v})} 
          />
          <SaveInputRow 
            label="App Key" 
            value={waConfig.appKey} 
            onChange={(v:string) => setWaConfig({...waConfig, appKey: v})} 
          />
          <SaveInputRow 
            label="Auth Key" 
            value={waConfig.authKey} 
            type="password"
            onChange={(v:string) => setWaConfig({...waConfig, authKey: v})} 
          />
        </div>
      </section>

      {/* 2. Auto Routing Settings - Matched with screenshot */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <SectionHeader title="إعدادات التوجيه التلقائي" subtitle="التحكم في توزيع المحادثات الجديدة تلقائياً على الموظفين" />
        <div className="space-y-6">
          <ToggleRow 
            label="التوجيه التلقائي" 
            desc="توزيع المحادثات الجديدة تلقائياً على الموظفين المتاحين" 
            checked={routing.autoRouting} 
            onChange={(v:boolean) => setRouting({...routing, autoRouting: v})} 
          />
          
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 block px-1">طريقة التوزيع</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-bold text-slate-700"
              value={routing.distributionMethod}
              onChange={(e) => setRouting({...routing, distributionMethod: e.target.value as any})}
            >
              <option value="random">عشوائي (Random)</option>
              <option value="round-robin">بالتساوي (Round Robin)</option>
            </select>
            <p className="text-[11px] text-slate-400 px-1">اختيار آلية توزيع المهام الجديدة على الموظفين</p>
          </div>

          <ToggleRow 
            label="إشعار الموظف عند التعيين" 
            desc="إرسال إشعار تنبيه للموظف عند تعيين محادثة جديدة له" 
            checked={routing.notifyOnAssign} 
            onChange={(v:boolean) => setRouting({...routing, notifyOnAssign: v})} 
          />

          <div className="flex items-end gap-4 border-t border-slate-50 pt-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 block px-1">الحد الأقصى للمحادثات لكل موظف</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-center font-bold"
                value={routing.maxChatsPerEmployee}
                onChange={e => setRouting({...routing, maxChatsPerEmployee: parseInt(e.target.value) || 0})}
              />
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md">حفظ</button>
          </div>
          <p className="text-[11px] text-slate-400 px-1">عدد المحادثات المسموح بها للموظف قبل توقف توجيه المحادثات الجديدة إليه</p>
        </div>
      </section>

      {/* 3. AI Agent Settings - Matched with screenshot */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <SectionHeader title="وكيل الذكاء الاصطناعي (AI Agent)" subtitle="إعدادات المساعد الذكي للرد على استفسارات العملاء" />
        <div className="space-y-8">
          <div className="p-6 bg-slate-50 rounded-[2rem]">
            <ToggleRow 
              label="تفعيل وكيل الذكاء الاصطناعي" 
              desc="عند التفعيل، سيقوم الوكيل تلقائياً بالرد على استفسارات العملاء" 
              checked={aiSettings.enabled} 
              onChange={(v:boolean) => setAiSettings({...aiSettings, enabled: v})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 block px-1">مزود الذكاء الاصطناعي</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-bold"
                value={aiSettings.activeProvider}
                onChange={(e) => setAiSettings({...aiSettings, activeProvider: e.target.value as any})}
              >
                <option value="gemini">Google Gemini (وصى به)</option>
                <option value="openai">OpenAI (ChatGPT)</option>
                <option value="groq">Groq (سرعة فائقة)</option>
                <option value="deepseek">DeepSeek</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 block px-1">الموديل</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-bold"
                value={aiSettings.activeModel}
                onChange={(e) => setAiSettings({...aiSettings, activeModel: e.target.value})}
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash (ذكي وسريع)</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="llama-3-70b">Llama 3 70B</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[12px] font-bold text-slate-500 block px-1 uppercase tracking-wider">مفاتيح API</label>
            {[
              { id: 'openai', name: 'OpenAI API Key' },
              { id: 'gemini', name: 'Google Gemini API Key' },
              { id: 'deepseek', name: 'DeepSeek API Key' },
              { id: 'groq', name: 'Groq API Key (اختياري)' },
            ].map(key => (
              <div key={key.id} className="flex gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                   <p className="text-[11px] font-bold text-slate-400 px-1">{key.name}</p>
                   <input 
                    type="password" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
                    value={aiSettings.apiKeys[key.id as keyof typeof aiSettings.apiKeys]}
                    readOnly
                   />
                </div>
                <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">اختيار</button>
              </div>
            ))}
            <p className="text-[10px] text-blue-500 px-1">احصل على مفتاح مجاني من <a href="#" className="underline">console.groq.com</a></p>
          </div>

          <div className="space-y-8 pt-4 border-t border-slate-50">
            <SectionHeader title="إعدادات متقدمة" />
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">درجة الإبداع (Temperature)</label>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{aiSettings.temperature}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={aiSettings.temperature}
                  onChange={e => setAiSettings({...aiSettings, temperature: parseFloat(e.target.value)})}
                />
                <p className="text-[10px] text-slate-400 italic">القيم المنخفضة تجعل الردود أكثر واقعية، والقيم العالية تجعلها أكثر إبداعاً وتنوعاً.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">الحد الأقصى للكلمات (Max Tokens)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                  value={aiSettings.maxTokens}
                  onChange={e => setAiSettings({...aiSettings, maxTokens: parseInt(e.target.value) || 0})}
                />
                <p className="text-[10px] text-slate-400 italic">يتحكم هذا في طول الرد التلقائي، القيمة الأعلى تستهلك رصيداً أكبر من الـ API.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">التعليمات النظامية (System Prompt)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 text-sm min-h-[150px] outline-none focus:ring-4 focus:ring-blue-500/10 text-right leading-relaxed"
                  value={aiSettings.systemPrompt}
                  onChange={e => setAiSettings({...aiSettings, systemPrompt: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Notifications Settings (Existing) */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <SectionHeader title="إعدادات الإشعارات والتنبيهات" subtitle="إعداد التنبيهات لمدير النظام والرد التلقائي بالذكاء الاصطناعي" />
        
        <div className="space-y-10">
          <ToggleRow 
            label="الرد التلقائي بالذكاء الاصطناعي" 
            desc="عند تفعيله، سيرد الذكاء الاصطناعي تلقائياً على رسائل العملاء" 
            checked={notifications.aiAutoReply} 
            onChange={(v:boolean) => setNotifications({...notifications, aiAutoReply: v})} 
          />

          <div className="space-y-6">
            <ToggleRow 
              label="تنبيه مدير النظام عند تأخر الرد" 
              desc="إرسال رسالة واتساب للمدير عند تأخر الموظف في الرد على طلب العميل" 
              checked={notifications.notifyAdminOnDelay} 
              onChange={(v:boolean) => setNotifications({...notifications, notifyAdminOnDelay: v})} 
            />

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 block">رقم واتساب مدير النظام</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-right font-mono"
                  value={notifications.adminPhone} 
                  onChange={e => setNotifications({...notifications, adminPhone: e.target.value})} 
                />
                <p className="text-[11px] text-slate-400 px-1">رقم الواتساب الذي سيتم إرسال التنبيهات إليه (بدون + أو 00)</p>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 block">مدة التأخير قبل الإشعار (بالدقائق)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-center font-bold"
                  value={notifications.delayThresholdMinutes} 
                  onChange={e => setNotifications({...notifications, delayThresholdMinutes: parseInt(e.target.value) || 0})} 
                />
                <p className="text-[11px] text-slate-400 px-1">عدد الدقائق التي يجب انتظارها بعد طلب العميل للتحدث مع موظف قبل إرسال التنبيه</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">قالب رسالة التنبيه</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500/10 text-right" 
                value={notifications.delayTemplate} 
                onChange={e => setNotifications({...notifications, delayTemplate: e.target.value})} 
              />
              <p className="text-[10px] text-slate-400">المتغيرات المتاحة: {'{{customer_name}}'}, {'{{customer_phone}}'}, {'{{conversation_id}}'}, {'{{wait_minutes}}'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Webhook & Footer */}
      <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
        <SectionHeader title="إعدادات الربط (Webhook)" subtitle="استخدم هذا الرابط في إعدادات بوابة الواتساب لاستقبال الرسائل الواردة" />
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">رابط الويب هوك (Webhook URL)</label>
          <div className="flex items-center gap-3">
            <input readOnly className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-500" value="https://design-system-pro--fm0002009.replit.app/wh" />
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md">نسخ</button>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4 pb-20">
         <button className="px-12 py-4 bg-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-300 transition-all">إلغاء</button>
         <button className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-1">حفظ كافة الإعدادات</button>
      </div>
    </div>
  );
};

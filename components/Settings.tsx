
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { WhatsAppConfig, AISettings } from '../types';

export const Settings: React.FC = () => {
  const [waConfig, setWaConfig] = useState<WhatsAppConfig>({
    baseUrl: 'https://darcoom.com/wsender',
    appKey: 'EXAMPLE_APP_KEY',
    authKey: 'EXAMPLE_AUTH_KEY',
    webhookSecret: 'shhh_secret',
  });

  const [aiSettings, setAiSettings] = useState<AISettings>({
    enabled: true,
    systemPrompt: 'أنت مساعد خدمة عملاء ودود لشركة تقنية متخصصة.',
    autoReply: false,
    safeHoursOnly: true,
  });

  return (
    <div className="max-w-4xl space-y-8">
      {/* WhatsApp Integration */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{TRANSLATIONS.whatsappIntegration}</h3>
          <p className="text-sm text-slate-500">قم بضبط مفاتيح الربط مع بوابة واتساب (wsender)</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base URL</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={waConfig.baseUrl}
              onChange={e => setWaConfig({...waConfig, baseUrl: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">App Key</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={waConfig.appKey}
              onChange={e => setWaConfig({...waConfig, appKey: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Auth Key</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={waConfig.authKey}
              onChange={e => setWaConfig({...waConfig, authKey: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Webhook Secret</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={waConfig.webhookSecret}
              onChange={e => setWaConfig({...waConfig, webhookSecret: e.target.value})}
            />
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button className="text-emerald-600 text-sm font-bold hover:underline">تحميل التوثيق البرمجي (Webhook Docs)</button>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
              {TRANSLATIONS.testConnection}
            </button>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              {TRANSLATIONS.save}
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{TRANSLATIONS.aiAssistance}</h3>
            <p className="text-sm text-slate-500">تحكم في سلوك الذكاء الاصطناعي في الردود</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={aiSettings.enabled} onChange={e => setAiSettings({...aiSettings, enabled: e.target.checked})} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Prompt (Arabic)</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[120px]"
              value={aiSettings.systemPrompt}
              onChange={e => setAiSettings({...aiSettings, systemPrompt: e.target.value})}
              placeholder="مثال: أنت وكيل دعم فني لموقع تسوق إلكتروني..."
            />
          </div>
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={aiSettings.autoReply} onChange={e => setAiSettings({...aiSettings, autoReply: e.target.checked})} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
              <span className="text-sm text-slate-700">تفعيل الرد التلقائي (Auto-Reply)</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={aiSettings.safeHoursOnly} onChange={e => setAiSettings({...aiSettings, safeHoursOnly: e.target.checked})} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
              <span className="text-sm text-slate-700">تطبيق خارج ساعات العمل فقط</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

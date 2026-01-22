
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'الأحد', inbound: 40, outbound: 24 },
  { name: 'الاثنين', inbound: 30, outbound: 13 },
  { name: 'الثلاثاء', inbound: 20, outbound: 98 },
  { name: 'الأربعاء', inbound: 27, outbound: 39 },
  { name: 'الخميس', inbound: 18, outbound: 48 },
  { name: 'الجمعة', inbound: 23, outbound: 38 },
  { name: 'السبت', inbound: 34, outbound: 43 },
];

const StatCard: React.FC<{ label: string; value: string; trend?: string; color: string }> = ({ label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="flex items-center gap-3">
      <div className={`w-2 h-8 rounded-full ${color}`}></div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={TRANSLATIONS.totalInbound} value="1,284" trend="+12%" color="bg-emerald-500" />
        <StatCard label={TRANSLATIONS.totalOutbound} value="842" trend="+5%" color="bg-blue-500" />
        <StatCard label={TRANSLATIONS.firstResponseTime} value="12 دقيقة" trend="-2 د" color="bg-orange-500" />
        <StatCard label={TRANSLATIONS.resolutionRate} value="94%" trend="+3%" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">نشاط المحادثات الأسبوعي</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="inbound" fill="#10b981" radius={[4, 4, 0, 0]} name="الوارد" />
                <Bar dataKey="outbound" fill="#3b82f6" radius={[4, 4, 0, 0]} name="الصادر" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">أفضل الوكلاء أداءً</h3>
          <div className="space-y-6">
            {[
              { name: 'خالد العتيبي', score: 98, chats: 45 },
              { name: 'سارة السعد', score: 95, chats: 38 },
              { name: 'محمد القحطاني', score: 92, chats: 52 },
              { name: 'أمل المطيري', score: 88, chats: 29 },
            ].map((agent, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=random`} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.chats} محادثة مغلقة</p>
                </div>
                <div className="text-emerald-600 font-bold text-sm">%{agent.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

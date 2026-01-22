
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { store } from '../services/mockStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportCard = ({ title, value, trend, desc, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
    <div>
      <div className="flex justify-between items-start mb-4">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black text-white ${color} shadow-lg shadow-current/20`}>{title}</span>
        {trend && <span className="text-emerald-500 font-black text-sm">+{trend}%</span>}
      </div>
      <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{value}</h3>
      <p className="text-slate-400 text-xs mt-2 font-bold leading-relaxed">{desc}</p>
    </div>
  </div>
);

export const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const dataDaily = [
    { name: 'الأحد', chats: 45, complaints: 5, satisfaction: 95, ai: 40 },
    { name: 'الاثنين', chats: 52, complaints: 8, satisfaction: 88, ai: 48 },
    { name: 'الثلاثاء', chats: 48, complaints: 3, satisfaction: 92, ai: 42 },
    { name: 'الأربعاء', chats: 61, complaints: 12, satisfaction: 85, ai: 55 },
    { name: 'الخميس', chats: 55, complaints: 4, satisfaction: 94, ai: 50 },
    { name: 'الجمعة', chats: 30, complaints: 2, satisfaction: 98, ai: 25 },
    { name: 'السبت', chats: 40, complaints: 6, satisfaction: 91, ai: 35 },
  ];

  const dataCategory = [
    { name: 'استفسارات مبيعات', value: 400 },
    { name: 'دعم تقني', value: 300 },
    { name: 'شكاوى عامة', value: 200 },
    { name: 'اقتراحات', value: 100 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32">
      {/* Header - Hidden on Print */}
      <div className="flex justify-between items-end print:hidden">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">التقارير التحليلية الشاملة</h2>
          <p className="text-slate-400 font-medium text-lg">تحليل ديموغرافي وإحصائي لكل خدمات النظام</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3 font-bold text-slate-600 outline-none shadow-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">آخر 24 ساعة</option>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="year">هذا العام</option>
          </select>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            تصدير PDF / طباعة
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center border-b-4 border-slate-900 pb-10 mb-10">
        <h1 className="text-5xl font-black text-slate-900 mb-4">تقرير أداء نظام CRM الموحد</h1>
        <p className="text-xl text-slate-500 font-bold">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
        <div className="flex justify-center gap-10 mt-6 text-slate-400 font-black text-sm uppercase tracking-widest">
          <span>WhatsApp Integration</span>
          <span>•</span>
          <span>AI Assistance</span>
          <span>•</span>
          <span>Quality Audit</span>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ReportCard title="كفاءة الرد" value="98.2%" trend="4.1" desc="نسبة المحادثات التي تم الرد عليها في أقل من 5 دقائق" color="bg-blue-600" />
        <ReportCard title="توفير AI" value="124 ساعة" trend="12.5" desc="الوقت التقديري الذي وفره الوكيل الذكي على الموظفين" color="bg-emerald-500" />
        <ReportCard title="حل النزاعات" value="89%" trend="2.0" desc="نسبة الشكاوى التي تم حلها من أول تواصل" color="bg-amber-500" />
        <ReportCard title="نمو العملاء" value="+420" trend="8.4" desc="عدد جهات الاتصال الجديدة المضافة خلال الفترة" color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Main Activity Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-800">تحليل تدفق المحادثات والشكاوى</h3>
            <div className="flex gap-4 text-[10px] font-black uppercase">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> محادثات</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> شكاوى</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataDaily}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorChats)" name="المحادثات" />
                <Area type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={4} fillOpacity={0} name="الشكاوى" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographic/Category Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-2xl font-black text-slate-800">التوزيع الديموغرافي للاستفسارات</h3>
          <div className="h-[400px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {dataCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-800">100%</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">إجمالي التصنيف</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {dataCategory.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-700">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{Math.round((item.value/1000)*100)}% من الإجمالي</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance Deep Dive */}
      <div className="bg-slate-900 rounded-[4rem] p-12 text-white space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl">🤖</div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">تحليل أداء وكيل الذكاء الاصطناعي</h3>
              <p className="text-blue-300 font-bold">قياس مدى فعالية الأتمتة والردود الذكية</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">معدل الدقة (Accuracy)</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[94%]" />
            </div>
            <p className="text-2xl font-black">94.8% <span className="text-sm font-bold text-emerald-400">+1.2%</span></p>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">نسبة التصعيد للبشر (Escalation)</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[15%]" />
            </div>
            <p className="text-2xl font-black">15.2% <span className="text-sm font-bold text-blue-400">-5.0%</span></p>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">رضا العملاء عن AI</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[88%]" />
            </div>
            <p className="text-2xl font-black">4.4 <span className="text-sm font-bold text-slate-400">/ 5</span></p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800">جدول ترتيب أداء الموظفين</h3>
          <button className="text-blue-600 font-black text-sm hover:underline">عرض التقرير التفصيلي لكل موظف</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">الموظف</th>
                <th className="px-10 py-6 text-center">إجمالي المحادثات</th>
                <th className="px-10 py-6 text-center">وقت الاستجابة</th>
                <th className="px-10 py-6 text-center">تقييم الجودة</th>
                <th className="px-10 py-6 text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'خالد العتيبي', chats: 842, time: '2.4 د', score: 4.9, status: 'EXCELLENT' },
                { name: 'سارة السعد', chats: 750, time: '3.1 د', score: 4.7, status: 'GOOD' },
                { name: 'محمد القحطاني', chats: 910, time: '5.2 د', score: 4.2, status: 'AVERAGE' },
              ].map((agent, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500">{agent.name[0]}</div>
                      <span className="font-black text-slate-800">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center font-bold text-slate-600">{agent.chats}</td>
                  <td className="px-10 py-6 text-center font-bold text-slate-600">{agent.time}</td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-black text-amber-500">
                      {agent.score} ★
                    </div>
                  </td>
                  <td className="px-10 py-6 text-left">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black ${
                      agent.status === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-600' : 
                      agent.status === 'GOOD' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

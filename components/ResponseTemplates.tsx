
import React, { useState } from 'react';
import { ResponseTemplate } from '../types';
import { store } from '../services/mockStore';

export const ResponseTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<ResponseTemplate[]>(store.templates);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'عام' });

  const filteredTemplates = templates.filter(t => 
    t.title.includes(searchTerm) || t.content.includes(searchTerm)
  );

  const handleAdd = () => {
    if (!formData.title || !formData.content) return;
    store.addTemplate(formData);
    setTemplates([...store.templates]);
    setShowModal(false);
    setFormData({ title: '', content: '', category: 'عام' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القالب؟')) {
      store.deleteTemplate(id);
      setTemplates([...store.templates]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-800">قوالب الردود</h2>
          <p className="text-slate-400 font-medium">إدارة قوالب الردود السريعة للمحادثات</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          إضافة قالب
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-48">
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none">
            <option>جميع الفئات</option>
            <option>عام</option>
            <option>معلومات</option>
          </select>
        </div>
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="ابحث في القوالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-2 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
          <svg className="w-5 h-5 absolute right-4 top-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 border-dashed p-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">لا توجد قوالب</h3>
          <p className="text-slate-400 max-w-xs">ابدأ بإضافة قالب رد سريع جديد لاستخدامه في محادثاتك مع العملاء</p>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            إضافة قالب
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{t.title}</h4>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{t.category}</span>
                </div>
                <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{t.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-bold text-slate-800">إضافة قالب جديد</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">عنوان القالب</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">محتوى القالب</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm min-h-[150px] outline-none" 
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4">
              <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">حفظ القالب</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-2xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Contact, ContactGroup } from '../types';
import { store } from '../services/mockStore';

export const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(store.contacts);
  const [groups] = useState<ContactGroup[]>(store.groups);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modals state
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'import' | 'groups' | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    tags: [],
    groupId: '',
  });

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleAction = (id: string, action: 'edit' | 'delete') => {
    if (action === 'delete') {
      if (confirm('هل أنت متأكد من حذف جهة الاتصال هذه؟')) {
        store.deleteContact(id);
        setContacts([...store.contacts]);
      }
    } else if (action === 'edit') {
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        setSelectedContact(contact);
        setFormData({ name: contact.name, phone: contact.phone, tags: contact.tags, groupId: contact.groupId });
        setShowModal('edit');
      }
    }
    setActiveMenuId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) return;
    if (showModal === 'add') {
      store.addContact(formData);
    } else if (showModal === 'edit' && selectedContact) {
      store.updateContact(selectedContact.id, formData);
    }
    setContacts([...store.contacts]);
    setShowModal(null);
    setFormData({ name: '', phone: '', tags: [], groupId: '' });
  };

  const exportContacts = () => {
    const csv = [
      ['الاسم', 'رقم الجوال', 'المجموعة'].join(','),
      ...contacts.map(c => [
        c.name,
        c.phone,
        groups.find(g => g.id === c.groupId)?.name || 'غير محدد'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-slate-800">جهات الاتصال</h2>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
            {contacts.length}
          </span>
          <p className="text-slate-400 font-medium mr-2">إدارة جميع العملاء وجهات الاتصال</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal('import')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            استيراد
          </button>
          <button 
            onClick={exportContacts}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            تصدير
          </button>
          <button 
            onClick={() => { setFormData({ name: '', phone: '', tags: [], groupId: '' }); setShowModal('add'); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            إضافة جديد
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-md mr-auto">
            <input 
              type="text" 
              placeholder="بحث بالاسم أو الرقم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 pr-12 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
            <svg className="w-5 h-5 absolute right-4 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-4">الاسم</th>
                <th className="px-8 py-4">رقم الجوال</th>
                <th className="px-8 py-4">المجموعة</th>
                <th className="px-8 py-4 text-left">الخيارات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <p className="font-bold">لا توجد جهات اتصال مطابقة</p>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shadow-sm">
                        {contact.name[0]}
                      </div>
                      <span className="font-bold text-slate-800">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-slate-500 tracking-wider">+{contact.phone}</span>
                  </td>
                  <td className="px-8 py-5">
                    {contact.groupId ? (
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${groups.find(g => g.id === contact.groupId)?.color || 'bg-slate-100 text-slate-500'}`}>
                        {groups.find(g => g.id === contact.groupId)?.name}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-left relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === contact.id ? null : contact.id)}
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                    </button>
                    
                    {/* Action Menu Popover */}
                    {activeMenuId === contact.id && (
                      <div className="absolute left-16 top-1/2 -translate-y-1/2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-30">
                        <button 
                          onClick={() => handleAction(contact.id, 'edit')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-right"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          تعديل
                        </button>
                        <button 
                          onClick={() => handleAction(contact.id, 'delete')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all text-right"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          حذف
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showModal === 'add' || showModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-right">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">{showModal === 'add' ? 'إضافة جهة اتصال' : 'تعديل جهة الاتصال'}</h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">الاسم الكامل</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/10" 
                  placeholder="مثال: محمد علي"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">رقم الجوال</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none font-mono tracking-widest focus:ring-2 focus:ring-blue-500/10" 
                  placeholder="966XXXXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-600">المجموعة</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none"
                  value={formData.groupId}
                  onChange={e => setFormData({...formData, groupId: e.target.value})}
                >
                  <option value="">غير محدد</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-4">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                {showModal === 'add' ? 'تأكيد الإضافة' : 'حفظ التعديلات'}
              </button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-white border border-slate-200 text-slate-500 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showModal === 'import' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-right">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">استيراد جهات اتصال</h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-400 transition-all bg-slate-50/50">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-700">اضغط هنا أو اسحب الملف للتحميل</p>
                  <p className="text-xs text-slate-400 mt-1">يدعم ملفات CSV, XLSX بحد أقصى 5MB</p>
                </div>
                <input type="file" className="hidden" id="fileImport" />
                <label htmlFor="fileImport" className="mt-4 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-100 transition-all shadow-sm">اختيار ملف</label>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 text-sm text-amber-800 leading-relaxed">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>تنبيه: يجب أن يحتوي الملف على عمودي "الاسم" و "رقم الجوال" على الأقل. سيتم تجاهل السجلات المكررة بناءً على رقم الجوال.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-4">
              <button disabled className="flex-1 bg-slate-300 text-white py-3.5 rounded-2xl font-bold cursor-not-allowed">بدء الاستيراد</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-white border border-slate-200 text-slate-500 py-3.5 rounded-2xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

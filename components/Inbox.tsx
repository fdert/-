
import React, { useState } from 'react';
import { Conversation, ConversationStatus, Priority } from '../types';
import { TRANSLATIONS } from '../constants';
import { store } from '../services/mockStore';
import { ChatWindow } from './ChatWindow';

export const Inbox: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'UNASSIGNED' | 'MINE' | 'ALL'>('MINE');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = store.conversations.filter(c => {
    const matchesSearch = c.contactName.includes(searchTerm) || c.contactPhone.includes(searchTerm);
    if (!matchesSearch) return false;
    
    if (filter === 'UNASSIGNED') return !c.assignedTo;
    if (filter === 'MINE') return c.assignedTo === store.currentUser.id;
    return true;
  });

  return (
    <div className="flex h-full gap-6">
      {/* List Panel */}
      <div className="w-[400px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search & Tabs */}
        <div className="p-4 space-y-4 border-b border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder={TRANSLATIONS.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2 p-1 bg-slate-50 rounded-lg">
            {[
              { id: 'MINE', label: TRANSLATIONS.assignedToMe },
              { id: 'UNASSIGNED', label: TRANSLATIONS.unassigned },
              { id: 'ALL', label: TRANSLATIONS.allChats }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id as any)}
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${
                  filter === t.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">لا توجد محادثات مطابقة</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`w-full p-4 flex gap-4 text-right transition-all border-b border-slate-50 hover:bg-slate-50 ${
                  selectedConv?.id === conv.id ? 'bg-emerald-50/50 border-r-4 border-emerald-500' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {conv.contactName[0]}
                  </div>
                  {conv.priority === Priority.URGENT && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-slate-800 text-sm truncate">{conv.contactName}</h5>
                    <span className="text-[10px] text-slate-400">
                      {new Date(conv.lastMessageAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-2">{conv.lastMessage}</p>
                  <div className="flex gap-1 overflow-hidden">
                    {conv.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-medium uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main View Panel */}
      <div className="flex-1 flex flex-col gap-6">
        {selectedConv ? (
          <div className="flex-1 flex gap-6">
            <div className="flex-1">
              <ChatWindow conversation={selectedConv} />
            </div>
            {/* Sidebar Details */}
            <div className="w-[300px] bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8 overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{TRANSLATIONS.customerProfile}</h4>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-3 shadow-inner">
                    {selectedConv.contactName[0]}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedConv.contactName}</h3>
                  <p className="text-slate-400 text-sm font-mono mt-1">+{selectedConv.contactPhone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">{TRANSLATIONS.tags}</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedConv.tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
                        {t}
                      </span>
                    ))}
                    <button className="px-2 py-1 border border-dashed border-slate-200 text-slate-400 rounded-lg text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all">
                      + إضافة وسم
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">{TRANSLATIONS.notes}</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-emerald-500/10 outline-none"
                    placeholder="أضف ملاحظات داخلية عن العميل..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2">{TRANSLATIONS.assignTo}</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm outline-none">
                    <option>{store.currentUser.name} (أنا)</option>
                    {store.users.filter(u => u.id !== store.currentUser.id).map(u => (
                      <option key={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  تم بدء المحادثة بتاريخ: {new Date(selectedConv.lastMessageAt).toLocaleDateString('ar-SA')}
                  <br />
                  موعد الاستحقاق (SLA): {new Date(selectedConv.slaDueAt).toLocaleString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">اختر محادثة للبدء</h3>
            <p className="text-slate-400 max-w-sm px-4">
              يمكنك اختيار أي محادثة من القائمة الجانبية للرد على العميل وتقديم الدعم المطلوب.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

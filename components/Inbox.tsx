
import React, { useState } from 'react';
import { Conversation, ConversationStatus, Priority } from '../types';
import { TRANSLATIONS } from '../constants';
import { store } from '../services/mockStore';
import { ChatWindow } from './ChatWindow';

export const Inbox: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(store.conversations[0] || null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'FAVORITES' | 'GROUPS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = store.conversations.filter(c => {
    const matchesSearch = c.contactName.includes(searchTerm) || c.contactPhone.includes(searchTerm);
    if (!matchesSearch) return false;
    
    // Logic for other filters can be added here
    return true;
  });

  return (
    <div className="flex h-full bg-[#f0f2f5] overflow-hidden">
      {/* Sidebar List Panel */}
      <div className="w-[350px] lg:w-[450px] flex flex-col bg-white border-l border-slate-200 shadow-sm relative z-20">
        
        {/* Sidebar Header */}
        <div className="p-4 bg-[#f0f2f5] flex items-center justify-between">
           <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(store.currentUser.name)}&background=random`} alt="" />
           </div>
           <div className="flex items-center gap-4 text-[#54656f]">
             <button className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.5-9H15c0-1.66-1.34-3-3-3s-3 1.34-3 3H7.5c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5z"/></svg></button>
             <button className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
             <button className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></button>
           </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-slate-100 flex items-center gap-2">
           <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="البحث عن دردشة أو بدء دردشة جديدة"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f0f2f5] border-none rounded-lg py-1.5 pr-10 pl-4 text-sm focus:ring-0 outline-none placeholder:text-[#667781]"
              />
              <svg className="w-4 h-4 absolute right-3 top-2.5 text-[#667781]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <button className="p-2 text-[#667781] hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
           </button>
        </div>

        {/* Filters Grid */}
        <div className="p-3 flex flex-wrap gap-2 border-b border-slate-50">
           {[
             { id: 'ALL', label: 'الكل' },
             { id: 'UNREAD', label: 'غير مقروء' },
             { id: 'FAVORITES', label: 'المفضلة' },
             { id: 'GROUPS', label: 'المجموعات' }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setFilter(t.id as any)}
               className={`px-3 py-1 rounded-full text-[13px] font-bold transition-all ${
                 filter === t.id ? 'bg-[#00a884] text-white' : 'bg-[#f0f2f5] text-[#54656f] hover:bg-slate-200'
               }`}
             >
               {t.label}
             </button>
           ))}
           <button className="px-3 py-1 bg-[#f0f2f5] text-[#54656f] rounded-full text-[13px] font-bold hover:bg-slate-200 flex items-center gap-1">
             التصنيفات <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
           </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full h-[72px] px-3 flex items-center gap-3 text-right transition-all border-b border-slate-50 hover:bg-[#f5f6f6] ${
                selectedConv?.id === conv.id ? 'bg-[#f0f2f5]' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conv.contactName)}&background=random`} alt="" />
                </div>
              </div>
              <div className="flex-1 min-w-0 h-full flex flex-col justify-center border-b border-slate-50">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h5 className="font-bold text-[#111b21] text-base truncate flex-1">{conv.contactName}</h5>
                  <span className={`text-[12px] ${selectedConv?.id === conv.id ? 'text-[#00a884]' : 'text-[#667781]'}`}>
                    {new Date(conv.lastMessageAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-1 flex-1 min-w-0">
                      {conv.assignedTo === store.currentUser.id && (
                        <svg className="w-4 h-4 text-[#53bdeb] shrink-0" viewBox="0 0 16 15" fill="none"><path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033L5.891 7.782a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185a.32.32 0 00.484-.033l6.38-8.73a.365.365 0 00-.071-.51z" fill="currentColor"/><path d="M12.158 3.316l-.478-.372a.365.365 0 00-.51.063L5.814 9.879a.32.32 0 01-.484.033L3.039 7.782a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185a.32.32 0 00.484-.033l6.38-8.73a.365.365 0 00-.071-.51z" fill="currentColor"/></svg>
                      )}
                      <p className="text-[13px] text-[#667781] truncate leading-tight">
                        {conv.lastMessage}
                      </p>
                   </div>
                   {conv.priority === Priority.URGENT && (
                     <div className="w-5 h-5 bg-[#25d366] rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                   )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat View Panel */}
      <div className="flex-1 flex flex-col relative">
        {selectedConv ? (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 border-r border-slate-200">
              <ChatWindow conversation={selectedConv} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#f0f2f5] border-r border-slate-200">
            <div className="w-[350px] space-y-8">
               <div className="relative">
                  <div className="w-full h-48 bg-[url('https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669ae5z23.png')] bg-contain bg-no-repeat bg-center"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-[32px] font-light text-[#41525d]">واتساب للكمبيوتر</h3>
                  <p className="text-sm text-[#667781] leading-relaxed">
                    أرسل واستقبل الرسائل دون إبقاء هاتفك متصلاً بالإنترنت.<br/>
                    استخدم واتساب على ما يصل إلى ٤ أجهزة مرتبطة وهاتف واحد في آن واحد.
                  </p>
               </div>
               <div className="pt-20 flex items-center justify-center gap-2 text-[#8696a0] text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  تشفير تام بين الطرفين
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

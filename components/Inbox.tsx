
import React, { useState, useEffect } from 'react';
import { Conversation } from '../types';
import { apiService } from '../services/apiService';
import { ChatWindow } from './ChatWindow';
import { store } from '../services/mockStore';

export const Inbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await apiService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConv) setSelectedConv(data[0]);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.contactName.includes(searchTerm) || c.contactPhone.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

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
                placeholder="البحث عن دردشة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f0f2f5] border-none rounded-lg py-1.5 pr-10 pl-4 text-sm focus:ring-0 outline-none placeholder:text-[#667781]"
              />
              <svg className="w-4 h-4 absolute right-3 top-2.5 text-[#667781]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
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
              <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shadow-sm shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conv.contactName)}&background=random`} alt="" />
              </div>
              <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
                <div className="flex justify-between items-baseline">
                  <h5 className="font-bold text-[#111b21] text-base truncate">{conv.contactName}</h5>
                  <span className="text-[11px] text-[#667781]">
                    {new Date(conv.lastMessageAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[13px] text-[#667781] truncate leading-tight">
                  {conv.lastMessage || 'دردشة جديدة'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col relative">
        {selectedConv ? (
          <ChatWindow conversation={selectedConv} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#f0f2f5]">
            <h3 className="text-xl text-[#41525d]">اختر محادثة للبدء</h3>
          </div>
        )}
      </div>
    </div>
  );
};

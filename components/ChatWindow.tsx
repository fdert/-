
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, ConversationStatus, Priority } from '../types';
import { store } from '../services/mockStore';
import { TRANSLATIONS } from '../constants';
import { AIService } from '../services/aiService';

interface ChatWindowProps {
  conversation: Conversation;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiService = new AIService(store.aiSettings);

  useEffect(() => {
    const convMessages = store.messages.filter(m => m.conversationId === conversation.id);
    setMessages(convMessages);
  }, [conversation.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = store.addMessage(conversation.id, inputText, 'OUTBOUND');
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const suggestAI = async () => {
    setIsAiSuggesting(true);
    const suggestion = await aiService.suggestReply(messages, conversation.contactName);
    setInputText(suggestion);
    setIsAiSuggesting(false);
  };

  const AttachmentMenuItem = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
    <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative overflow-hidden">
      {/* WhatsApp Doodle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

      {/* Header */}
      <div className="z-10 px-4 py-2 bg-[#f0f2f5] flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.contactName)}&background=random`} alt="" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-[#111b21] leading-tight text-base">{conversation.contactName}</h4>
            <p className="text-[12px] text-[#667781]">آخر ظهور اليوم عند {new Date(conversation.lastMessageAt).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#54656f]">
          <button className="hover:bg-slate-200 p-2 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></button>
          <button className="hover:bg-slate-200 p-2 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="z-10 flex-1 overflow-y-auto p-4 lg:px-20 space-y-2 scroll-smooth"
      >
        <div className="flex justify-center my-4">
          <span className="bg-[#fff] text-[#54656f] text-[12px] px-3 py-1.5 rounded-lg shadow-sm font-bold uppercase tracking-wider">اليوم</span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex w-full mb-1 ${m.direction === 'OUTBOUND' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] lg:max-w-[65%] px-2 py-1.5 rounded-xl shadow-sm relative group ${
              m.direction === 'OUTBOUND' 
                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none ml-2' 
                : 'bg-white text-[#111b21] rounded-tl-none mr-2'
            }`}>
              
              {/* Media Content Rendering */}
              {m.type === 'image' && (
                <div className="mb-1 rounded-lg overflow-hidden border border-black/5">
                  <img src={m.mediaUrl} className="max-w-full h-auto block" alt="" />
                </div>
              )}

              {m.type === 'audio' && (
                <div className="flex items-center gap-3 p-2 bg-black/5 rounded-lg min-w-[250px]">
                   <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#54656f] shadow-sm">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </button>
                   <div className="flex-1 space-y-1">
                     <div className="h-1 bg-slate-300 rounded-full relative overflow-hidden">
                       <div className="absolute inset-0 bg-[#00a884] w-1/3"></div>
                     </div>
                     <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                       <span>0:45</span>
                       <span>1:12</span>
                     </div>
                   </div>
                   <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img src={`https://ui-avatars.com/api/?name=${m.direction === 'OUTBOUND' ? 'Me' : 'Customer'}`} alt="" />
                   </div>
                </div>
              )}

              {m.type === 'file' && (
                <div className="flex items-center gap-3 p-3 bg-black/5 rounded-lg mb-1 border border-black/5">
                   <div className="w-10 h-10 bg-[#7f66ff] rounded-lg flex items-center justify-center text-white">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-bold truncate">{m.mediaName || 'Document.pdf'}</p>
                     <p className="text-[10px] text-slate-500">2.4 MB • PDF</p>
                   </div>
                </div>
              )}

              <p className="text-[14.2px] leading-normal whitespace-pre-wrap px-1">{m.text}</p>
              
              <div className="flex items-center justify-end gap-1 mt-0.5 ml-2 mr-1">
                <span className="text-[11px] text-[#667781]">
                  {new Date(m.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
                {m.direction === 'OUTBOUND' && (
                  <svg className="w-4 h-4 text-[#53bdeb]" viewBox="0 0 16 15" fill="none"><path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033L5.891 7.782a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185a.32.32 0 00.484-.033l6.38-8.73a.365.365 0 00-.071-.51z" fill="currentColor"/><path d="M12.158 3.316l-.478-.372a.365.365 0 00-.51.063L5.814 9.879a.32.32 0 01-.484.033L3.039 7.782a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185a.32.32 0 00.484-.033l6.38-8.73a.365.365 0 00-.071-.51z" fill="currentColor"/></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestion Bar */}
      {isAiSuggesting && (
        <div className="z-20 bg-white/80 backdrop-blur-md px-6 py-3 border-t border-slate-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <span className="text-sm font-bold text-blue-600">الوكيل الذكي يفكر في رد مناسب...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="z-10 bg-[#f0f2f5] px-4 py-2.5 flex items-center gap-3 border-t border-slate-200">
        <div className="flex items-center gap-1 text-[#54656f]">
          <button className="p-2 hover:bg-slate-200 rounded-full transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg></button>
          
          <div className="relative">
            <button 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-2 hover:bg-slate-200 rounded-full transition-all ${showAttachMenu ? 'rotate-45 text-[#00a884]' : ''}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>

            {/* WhatsApp Attachment Menu */}
            {showAttachMenu && (
              <div className="absolute bottom-14 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in slide-in-from-bottom-5 duration-200 z-50 overflow-hidden">
                <AttachmentMenuItem icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>} label="مستند" color="bg-[#7f66ff]" />
                <AttachmentMenuItem icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>} label="الصور ومقاطع الفيديو" color="bg-[#007bfc]" />
                <AttachmentMenuItem icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>} label="جهة اتصال" color="bg-[#00a7f7]" />
                <AttachmentMenuItem icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l3.59-3.58L17 12l-5 5z"/></svg>} label="استطلاع رأي" color="bg-[#ffbc38]" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())}
            placeholder="اكتب رسالة"
            className="w-full bg-white border-none rounded-lg px-4 py-2.5 text-sm focus:ring-0 outline-none text-[#111b21]"
          />
        </div>

        <div className="flex items-center gap-1 text-[#54656f]">
          {inputText.trim() ? (
            <button 
              onClick={handleSend}
              className="p-2 hover:bg-slate-200 rounded-full text-[#00a884] transition-colors"
            >
              <svg className="w-7 h-7 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          ) : (
            <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            </button>
          )}
          
          <button 
            onClick={suggestAI}
            className={`p-2 hover:bg-blue-50 rounded-full transition-all ${isAiSuggesting ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}
            title="اقتراح رد ذكي"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

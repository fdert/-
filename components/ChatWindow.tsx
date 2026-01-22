
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, ConversationStatus, Priority } from '../types';
import { store } from '../services/mockStore';
import { TRANSLATIONS } from '../constants';
import { AIService } from '../services/aiService';

interface ChatWindowProps {
  conversation: Conversation;
}

const aiService = new AIService();

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter messages for this conversation
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

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            {conversation.contactName[0]}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 leading-tight">{conversation.contactName}</h4>
            <p className="text-xs text-slate-500 font-mono tracking-wider">+{conversation.contactPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
             conversation.priority === Priority.URGENT ? 'bg-rose-100 text-rose-600' :
             conversation.priority === Priority.HIGH ? 'bg-orange-100 text-orange-600' :
             'bg-slate-100 text-slate-600'
           }`}>
             {TRANSLATIONS[conversation.priority.toLowerCase() as keyof typeof TRANSLATIONS]}
           </span>
           <select 
             className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
             value={conversation.status}
             onChange={(e) => store.updateConversationStatus(conversation.id, e.target.value as ConversationStatus)}
           >
             <option value={ConversationStatus.OPEN}>{TRANSLATIONS.open}</option>
             <option value={ConversationStatus.PENDING}>{TRANSLATIONS.pending}</option>
             <option value={ConversationStatus.CLOSED}>{TRANSLATIONS.closed}</option>
           </select>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-fixed opacity-90"
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
              m.direction === 'OUTBOUND' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
              <div className={`text-[10px] mt-1 flex items-center gap-1 ${m.direction === 'OUTBOUND' ? 'text-emerald-100 justify-end' : 'text-slate-400 justify-start'}`}>
                {new Date(m.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                {m.direction === 'OUTBOUND' && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 space-y-3">
        <div className="flex gap-2">
          <button 
            onClick={suggestAI}
            disabled={isAiSuggesting}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 border border-emerald-100"
          >
            <svg className={`w-3.5 h-3.5 ${isAiSuggesting ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {TRANSLATIONS.suggestReply}
          </button>
          <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
            اختصارات (/)
          </button>
        </div>

        <div className="flex items-end gap-3">
          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder={TRANSLATIONS.typeMessage}
              rows={1}
              className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
            />
          </div>
          <button 
            onClick={handleSend}
            className="p-3 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

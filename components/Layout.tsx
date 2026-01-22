
import React, { useState } from 'react';
import { ICONS, TRANSLATIONS } from '../constants';
import { UserRole } from '../types';
import { store } from '../services/mockStore';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.FC<any>;
  isActive: boolean;
  onClick: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive 
        ? 'bg-emerald-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const user = store.currentUser;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 flex flex-col p-4 shadow-2xl z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">ArCRM <span className="text-emerald-500">WhatsApp</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            id="dashboard" 
            label={TRANSLATIONS.dashboard} 
            icon={ICONS.Dashboard} 
            isActive={activeTab === 'dashboard'} 
            onClick={onTabChange} 
          />
          <SidebarItem 
            id="inbox" 
            label={TRANSLATIONS.inbox} 
            icon={ICONS.Inbox} 
            isActive={activeTab === 'inbox'} 
            onClick={onTabChange} 
          />
          <SidebarItem 
            id="contacts" 
            label={TRANSLATIONS.contacts} 
            icon={ICONS.Users} 
            isActive={activeTab === 'contacts'} 
            onClick={onTabChange} 
          />
          <SidebarItem 
            id="reports" 
            label={TRANSLATIONS.reports} 
            icon={ICONS.Chart} 
            isActive={activeTab === 'reports'} 
            onClick={onTabChange} 
          />
          {user.role === UserRole.ADMIN && (
            <SidebarItem 
              id="settings" 
              label={TRANSLATIONS.settings} 
              icon={ICONS.Settings} 
              isActive={activeTab === 'settings'} 
              onClick={onTabChange} 
            />
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`} 
              className="w-10 h-10 rounded-full" 
              alt="Avatar" 
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-slate-100 text-sm font-semibold truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.role}</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-sm font-medium">
            <span>{TRANSLATIONS.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {TRANSLATIONS[activeTab as keyof typeof TRANSLATIONS]}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              متصل
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

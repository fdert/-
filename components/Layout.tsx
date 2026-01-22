
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
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
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
      <aside className="w-72 bg-white flex flex-col p-4 border-l border-slate-200 z-20">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600">تواصل</span>
            <span className="text-xl font-bold text-slate-400">CRM.</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <SidebarItem id="dashboard" label={TRANSLATIONS.dashboard} icon={ICONS.Dashboard} isActive={activeTab === 'dashboard'} onClick={onTabChange} />
          <SidebarItem id="inbox" label={TRANSLATIONS.inbox} icon={ICONS.Inbox} isActive={activeTab === 'inbox'} onClick={onTabChange} />
          <SidebarItem id="contacts" label={TRANSLATIONS.contacts} icon={ICONS.Users} isActive={activeTab === 'contacts'} onClick={onTabChange} />
          <SidebarItem id="templates" label={TRANSLATIONS.templates} icon={ICONS.Templates} isActive={activeTab === 'templates'} onClick={onTabChange} />
          <SidebarItem id="complaints" label={TRANSLATIONS.complaints} icon={ICONS.Complaint} isActive={activeTab === 'complaints'} onClick={onTabChange} />
          <SidebarItem id="evaluations" label={TRANSLATIONS.evaluations} icon={ICONS.Star} isActive={activeTab === 'evaluations'} onClick={onTabChange} />
          <SidebarItem id="teams" label={TRANSLATIONS.teamManagement} icon={ICONS.Teams} isActive={activeTab === 'teams'} onClick={onTabChange} />
          <SidebarItem id="employees" label={TRANSLATIONS.employees} icon={ICONS.Users} isActive={activeTab === 'employees'} onClick={onTabChange} />
          <SidebarItem id="reports" label={TRANSLATIONS.reports} icon={ICONS.Chart} isActive={activeTab === 'reports'} onClick={onTabChange} />
          <SidebarItem id="settings" label={TRANSLATIONS.settings} icon={ICONS.Settings} isActive={activeTab === 'settings'} onClick={onTabChange} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-slate-800 text-sm font-bold truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">مدير النظام</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

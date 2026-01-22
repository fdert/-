
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inbox } from './components/Inbox';
import { Settings } from './components/Settings';
import { UserManagement } from './components/UserManagement';
import { Contacts } from './components/Contacts';
import { ResponseTemplates } from './components/ResponseTemplates';
import { Evaluations } from './components/Evaluations';
import { Complaints } from './components/Complaints';
import { Reports } from './components/Reports';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inbox': return <Inbox />;
      case 'contacts': return <Contacts />;
      case 'templates': return <ResponseTemplates />;
      case 'complaints': return <Complaints />;
      case 'evaluations': return <Evaluations />;
      case 'employees': return <UserManagement />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center opacity-50">
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2H5a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="font-bold">هذه الصفحة ({activeTab}) قيد التطوير حالياً</p>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;

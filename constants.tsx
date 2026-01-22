
import React from 'react';

export const TRANSLATIONS = {
  dashboard: 'لوحة التحكم',
  inbox: 'المحادثات',
  contacts: 'جهات الاتصال',
  templates: 'قوالب الردود',
  evaluations: 'التقييمات والآراء',
  complaints: 'نظام الشكاوي الذكي',
  teamManagement: 'إدارة الفرق',
  employees: 'إدارة الموظفين',
  reports: 'التقارير',
  settings: 'الإعدادات',
  logout: 'تسجيل الخروج',
  unassigned: 'غير معين',
  assignedToMe: 'محادثاتي',
  allChats: 'كل المحادثات',
  closed: 'المغلقة',
  followUp: 'متابعة',
  slaRisk: 'مخاطر SLA',
  search: 'بحث بالاسم أو الرقم...',
  send: 'إرسال',
  typeMessage: 'اكتب رسالتك هنا...',
  customerProfile: 'ملف العميل',
  tags: 'الوسوم',
  notes: 'ملاحظات',
  priority: 'الأولوية',
  status: 'الحالة',
  assignTo: 'تعيين إلى',
  reassign: 'إعادة تعيين',
  firstResponseTime: 'متوسط وقت الرد الأول',
  resolutionRate: 'معدل الإغلاق',
  totalInbound: 'إجمالي الوارد',
  totalOutbound: 'إجمالي الصادر',
  activeAgents: 'الوكلاء المتصلون',
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  urgent: 'عاجلة',
  open: 'مفتوحة',
  pending: 'معلقة',
  save: 'حفظ',
  cancel: 'إلغاء',
  testConnection: 'اختبار الاتصال',
  aiAssistance: 'وكيل الذكاء الاصطناعي (AI Agent)',
  suggestReply: 'اقتراح رد',
  importContacts: 'استيراد جهات الاتصال',
  whatsappIntegration: 'إعدادات WhatsApp (wsender)',
  webhookSettings: 'إعدادات الربط (Webhook)',
  routingSettings: 'إعدادات التوجيه التلقائي',
  notificationSettings: 'إعدادات الإشعارات والتنبيهات',
  evaluationSettings: 'إعدادات التقييمات',
  apiKeys: 'مفاتيح API',
  advancedSettings: 'إعدادات متقدمة',
  creativeDegree: 'درجة الإبداع (Temperature)',
  maxTokens: 'الحد الأقصى للكلمات (Max Tokens)',
  systemPromptLabel: 'التعليمات النظامية (System Prompt)',
};

export const ICONS = {
  Dashboard: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Inbox: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h4.5M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Users: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Templates: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Star: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  Complaint: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
    </svg>
  ),
  Teams: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  Chart: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Settings: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.797.915a7.316 7.316 0 002.316 1.028c.394.124.811-.005 1.082-.315l.635-.72a1.125 1.125 0 011.666 0l.773.877a1.125 1.125 0 010 1.587l-.635.72a1.076 1.076 0 00-.315 1.082 7.316 7.316 0 001.028 2.316c.151.413.491.727.915.797l.894.149c.542.09.94.56.94 1.11v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.384-.915.797a7.316 7.316 0 00-1.028 2.316c-.124.394.005.811.315 1.082l.72.635a1.125 1.125 0 010 1.666l-.877.773a1.125 1.125 0 01-1.587 0l-.72-.635a1.076 1.076 0 00-1.082-.315 7.316 7.316 0 00-2.316 1.028c-.413.151-.727.491-.797.915l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.797-.915a7.316 7.316 0 00-2.316-1.028c-.394-.124-.811.005-1.082.315l-.635.72a1.125 1.125 0 01-1.666 0l-.773-.877a1.125 1.125 0 010-1.587l.635-.72a1.076 1.076 0 00.315-1.082 7.316 7.316 0 00-1.028-2.316c-.151-.413-.491-.727-.915-.797l-.894-.149c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.384.915-.797a7.316 7.316 0 001.028-2.316c.124-.394-.005-.811-.315-1.082l-.72-.635a1.125 1.125 0 010-1.666l.877-.773a1.125 1.125 0 011.587 0l.72.635c.271.31.688.439 1.082.315a7.316 7.316 0 002.316-1.028c.413-.151.727-.491.797-.915l.149-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};


import { Conversation, Message, User, UserRole, ConversationStatus, Priority, Contact, AISettings, UserPermissions, Complaint, ComplaintStatus, Evaluation, ContactGroup, ResponseTemplate, WhatsAppConfig } from '../types';

class MockStore {
  users: User[] = [
    { id: 'u1', name: 'مدير النظام', email: 'admin@arcrm.com', role: UserRole.ADMIN, isActive: true, permissions: { canManageSettings: true, canManageUsers: true, canViewReports: true, canReassignChats: true, canExportData: true } }
  ];
  
  messages: Message[] = [
     { id: 'm1', conversationId: 'conv1', direction: 'INBOUND', type: 'text', text: 'مرحباً، أواجه مشكلة في طلبي الأخير', status: 'read', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
     { id: 'm2', conversationId: 'conv1', direction: 'OUTBOUND', type: 'text', text: 'أهلاً بك، نحن هنا للمساعدة. ما هو رقم الطلب؟', status: 'read', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
     { id: 'm3', conversationId: 'conv1', direction: 'INBOUND', type: 'audio', text: 'رسالة صوتية', mediaUrl: '#', status: 'read', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
     { id: 'm4', conversationId: 'conv1', direction: 'INBOUND', type: 'image', text: 'صورة الإيصال', mediaUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=600', status: 'read', timestamp: new Date(Date.now() - 1800000).toISOString() },
     { id: 'm5', conversationId: 'conv1', direction: 'OUTBOUND', type: 'file', text: 'تم استلام الإيصال، إليك ملف التأكيد', mediaUrl: '#', mediaName: 'Confirmation_Receipt.pdf', status: 'delivered', timestamp: new Date().toISOString() }
  ];

  conversations: Conversation[] = [
    {
      id: 'conv1',
      contactId: 'ct1',
      contactName: 'عبد المحسن',
      contactPhone: '966535983261',
      status: ConversationStatus.OPEN,
      priority: Priority.URGENT,
      assignedTo: 'u1',
      lastMessage: 'تم استلام الإيصال، إليك ملف التأكيد',
      lastMessageAt: new Date().toISOString(),
      slaDueAt: new Date(Date.now() + 3600000).toISOString(),
      tags: ['VIP', 'شكوى'],
      isAiManaged: false
    },
    {
      id: 'conv2',
      contactId: 'ct2',
      contactName: 'سارة السعد',
      contactPhone: '966555123456',
      status: ConversationStatus.OPEN,
      priority: Priority.MEDIUM,
      assignedTo: 'u1',
      lastMessage: 'كم يستغرق الشحن لمدينة الرياض؟',
      lastMessageAt: new Date(Date.now() - 15000000).toISOString(),
      slaDueAt: new Date(Date.now() + 7200000).toISOString(),
      tags: ['مبيعات'],
      isAiManaged: true
    }
  ];

  contacts: Contact[] = [
    { id: 'ct1', name: 'عبد المحسن', phone: '966535983261', tags: ['VIP'], createdAt: new Date().toISOString() }
  ];

  groups: ContactGroup[] = [
    { id: 'g1', name: 'عملاء مميزون', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'g2', name: 'قائمة سوداء', color: 'bg-rose-100 text-rose-600' }
  ];

  templates: ResponseTemplate[] = [
    { id: 't1', title: 'ترحيب', content: 'أهلاً بك في وكالة إبداع، كيف يمكننا مساعدتك اليوم؟', category: 'عام', createdAt: new Date().toISOString() }
  ];

  complaints: Complaint[] = [
    {
      id: 'c1',
      complaintNumber: 'CR-8241',
      contactId: 'ct1',
      contactName: 'عبد المحسن',
      contactPhone: '966535983261',
      category: 'خدمة العملاء',
      summary: 'تأخر في الرد لأكثر من 3 ساعات',
      details: 'العميل تواصل بخصوص طلب سابق ولم يتم الرد عليه، مما أدى لانزعاجه الشديد.',
      status: ComplaintStatus.PENDING,
      aiAnalysis: {
        rootCause: 'ضغط عمل عالي على الموظف المسؤول ونقص في المتابعة التلقائية.',
        customerSentiment: 'غاضب جداً (High Frustration)',
        suggestedSolutions: [
          'تقديم اعتذار رسمي وخصم 10% على الطلب القادم.',
          'توضيح سبب التأخير والوعد بالرد خلال 15 دقيقة.',
          'تحويل الشكوى فوراً لمدير القسم للمتابعة الشخصية.'
        ]
      },
      messages: [],
      createdAt: '2025-01-22T14:30:00Z',
      updatedAt: '2025-01-22T14:30:00Z'
    }
  ];

  evaluations: Evaluation[] = [
    { id: 'e1', contactName: 'سارة خالد', contactPhone: '966500000000', rating: 5, comment: 'خدمة ممتازة وسريعة جداً، شكراً لكم.', category: 'عام', status: 'PENDING', createdAt: new Date().toISOString() }
  ];

  currentUser: User = this.users[0];
  
  aiSettings: AISettings = {
    enabled: true,
    activeProvider: 'gemini',
    activeModel: 'gemini-3-flash-preview',
    apiKeys: { gemini: '', openai: '', deepseek: '', groq: '' },
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'أنت نظام إدارة علاقات عملاء ذكي، هدفك حل مشاكل العملاء باحترافية وسرعة.',
    autoReply: true,
    handleOrders: true,
    handleRatings: true,
    handleComplaints: true,
  };

  whatsappConfig: WhatsAppConfig = {
    baseUrl: 'https://darcoom.com/wsender',
    appKey: '52a594b2-74e7-4449-a58f-cd95b9c1822a',
    authKey: '••••••••••••••••••••••••••••••••••••••••••••••••••',
    webhookSecret: 'shhh_secret',
  };

  addMessage(conversationId: string, text: string, direction: 'INBOUND' | 'OUTBOUND'): Message {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      direction,
      type: 'text',
      text,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
    this.messages.push(newMessage);
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageAt = newMessage.timestamp;
    }
    return newMessage;
  }

  updateConversationStatus(id: string, status: ConversationStatus) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) conv.status = status;
  }

  toggleAiManagement(id: string) {
    const conv = this.conversations.find(c => c.id === id);
    if (conv) conv.isAiManaged = !conv.isAiManaged;
  }

  updateUser(id: string, updates: Partial<User>) {
    this.users = this.users.map(u => u.id === id ? { ...u, ...updates } : u);
  }

  deleteUser(id: string) {
    this.users = this.users.filter(u => u.id !== id);
  }

  addUser(data: Omit<User, 'id' | 'permissions'>) {
    const newUser: User = {
      ...data,
      id: `u${this.users.length + 1}`,
      permissions: { canManageSettings: false, canManageUsers: false, canViewReports: true, canReassignChats: false, canExportData: false }
    };
    this.users.push(newUser);
  }

  deleteContact(id: string) {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }

  addContact(data: Omit<Contact, 'id' | 'createdAt'>) {
    const newContact: Contact = {
      ...data,
      id: `ct${this.contacts.length + 1}`,
      createdAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
  }

  updateContact(id: string, updates: Partial<Contact>) {
    this.contacts = this.contacts.map(c => c.id === id ? { ...c, ...updates } : c);
  }

  addTemplate(data: Omit<ResponseTemplate, 'id' | 'createdAt'>) {
    const newTemplate: ResponseTemplate = {
      ...data,
      id: `t${this.templates.length + 1}`,
      createdAt: new Date().toISOString()
    };
    this.templates.push(newTemplate);
  }

  deleteTemplate(id: string) {
    this.templates = this.templates.filter(t => t.id !== id);
  }

  addComplaint(data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'updatedAt' | 'messages'>) {
    const newComplaint: Complaint = {
      ...data,
      id: `comp_${Math.random().toString(36).substr(2, 9)}`,
      complaintNumber: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.complaints = [newComplaint, ...this.complaints];
    return newComplaint;
  }

  updateComplaint(id: string, updates: Partial<Complaint>) {
    this.complaints = this.complaints.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
  }

  addMessageToComplaint(complaintId: string, text: string, direction: 'INBOUND' | 'OUTBOUND') {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (complaint) {
      const msg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        conversationId: complaintId,
        direction,
        type: 'text',
        text,
        status: 'sent',
        timestamp: new Date().toISOString()
      };
      complaint.messages.push(msg);
      complaint.updatedAt = new Date().toISOString();
    }
  }
}

export const store = new MockStore();

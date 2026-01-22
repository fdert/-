
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT'
}

export interface UserPermissions {
  canManageSettings: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canReassignChats: boolean;
  canExportData: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  teamId?: string;
  avatar?: string;
  permissions: UserPermissions;
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface Complaint {
  id: string;
  complaintNumber: string; // CR-XXXX
  contactId: string;
  contactName: string;
  contactPhone: string;
  category: string;
  summary: string;
  details: string;
  status: ComplaintStatus;
  aiAnalysis: {
    rootCause: string;
    customerSentiment: string;
    suggestedSolutions: string[];
  };
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  contactName: string;
  contactPhone: string;
  rating: number; // 1-5
  comment: string;
  category: string;
  status: 'PENDING' | 'REPLIED';
  createdAt: string;
}

export interface ResponseTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  groupId?: string;
  notes?: string;
  createdAt: string;
}

// Added missing ContactGroup interface
export interface ContactGroup {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  type: 'text' | 'image' | 'file' | 'audio';
  text?: string;
  mediaUrl?: string;
  mediaName?: string;
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'read';
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  status: ConversationStatus;
  priority: Priority;
  assignedTo?: string;
  lastMessage?: string;
  lastMessageAt: string;
  slaDueAt: string;
  tags: string[];
  isAiManaged?: boolean;
}

export interface WhatsAppConfig {
  baseUrl: string;
  appKey: string;
  authKey: string;
  webhookSecret: string;
}

export interface AISettings {
  enabled: boolean;
  activeProvider: 'gemini' | 'openai' | 'deepseek' | 'groq';
  activeModel: string;
  apiKeys: {
    gemini: string;
    openai: string;
    deepseek: string;
    groq: string;
  };
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoReply: boolean;
  handleOrders: boolean;
  handleRatings: boolean;
  handleComplaints: boolean;
}

// Added missing RoutingSettings interface
export interface RoutingSettings {
  autoRouting: boolean;
  distributionMethod: 'random' | 'round-robin';
  notifyOnAssign: boolean;
  maxChatsPerEmployee: number;
}

// Added missing NotificationSettings interface
export interface NotificationSettings {
  aiAutoReply: boolean;
  notifyAdminOnDelay: boolean;
  adminPhone: string;
  delayThresholdMinutes: number;
  delayTemplate: string;
  complaintTemplate: string;
  notificationApi: {
    baseUrl: string;
    appKey: string;
    authKey: string;
    webhookSecret: string;
  };
}

// Added missing EvaluationSettings interface
export interface EvaluationSettings {
  enabled: boolean;
  waitHours: number;
}

export interface AppSettings {
  whatsapp: WhatsAppConfig;
  ai: AISettings;
}


export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  teamId?: string;
  avatar?: string;
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
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  type: 'text' | 'image' | 'file' | 'audio';
  text?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaMime?: string;
  status: 'queued' | 'sent' | 'failed' | 'delivered' | 'read';
  timestamp: string;
  senderName?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  status: ConversationStatus;
  priority: Priority;
  assignedTo?: string; // User ID
  lastMessage?: string;
  lastMessageAt: string;
  slaDueAt: string;
  tags: string[];
}

export interface WhatsAppConfig {
  baseUrl: string;
  appKey: string;
  authKey: string;
  webhookSecret: string;
}

export interface AISettings {
  enabled: boolean;
  systemPrompt: string;
  autoReply: boolean;
  safeHoursOnly: boolean;
}


import { Conversation, Message, User, UserRole, ConversationStatus, Priority, Contact } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'أحمد الإداري', email: 'admin@arcrm.com', role: UserRole.ADMIN, isActive: true },
  { id: 'u2', name: 'سارة المشرفة', email: 'supervisor@arcrm.com', role: UserRole.SUPERVISOR, isActive: true },
  { id: 'u3', name: 'خالد الوكيل', email: 'agent1@arcrm.com', role: UserRole.AGENT, isActive: true, teamId: 't1' },
];

const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'محمد عبد الله', phone: '966500000001', tags: ['VIP', 'جديد'], createdAt: new Date().toISOString() },
  { id: 'c2', name: 'ريم علي', phone: '966500000002', tags: ['دعم فني'], createdAt: new Date().toISOString() },
  { id: 'c3', name: 'فيصل العتيبي', phone: '966500000003', tags: ['مبيعات'], createdAt: new Date().toISOString() },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    contactId: 'c1',
    contactName: 'محمد عبد الله',
    contactPhone: '966500000001',
    status: ConversationStatus.OPEN,
    priority: Priority.HIGH,
    assignedTo: 'u3',
    lastMessage: 'أهلاً، أريد الاستفسار عن الشحن',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    slaDueAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    tags: ['VIP']
  },
  {
    id: 'conv2',
    contactId: 'c2',
    contactName: 'ريم علي',
    contactPhone: '966500000002',
    status: ConversationStatus.OPEN,
    priority: Priority.MEDIUM,
    assignedTo: undefined,
    lastMessage: 'الخدمة لا تعمل لدي',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    slaDueAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    tags: ['دعم فني']
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    conversationId: 'conv1',
    direction: 'INBOUND',
    type: 'text',
    text: 'أهلاً، أريد الاستفسار عن الشحن',
    status: 'delivered',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'm2',
    conversationId: 'conv2',
    direction: 'INBOUND',
    type: 'text',
    text: 'الخدمة لا تعمل لدي',
    status: 'delivered',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

class MockStore {
  conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  messages: Message[] = [...INITIAL_MESSAGES];
  contacts: Contact[] = [...MOCK_CONTACTS];
  users: User[] = [...MOCK_USERS];
  currentUser: User = MOCK_USERS[0];

  addMessage(conversationId: string, text: string, direction: 'INBOUND' | 'OUTBOUND', type: 'text' | 'image' | 'file' | 'audio' = 'text', mediaUrl?: string) {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      direction,
      type,
      text,
      mediaUrl,
      status: direction === 'OUTBOUND' ? 'sent' : 'delivered',
      timestamp: new Date().toISOString()
    };
    this.messages.push(newMessage);
    
    // Update conversation
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text || `[${type}]`;
      conv.lastMessageAt = newMessage.timestamp;
    }
    
    return newMessage;
  }

  assignConversation(conversationId: string, userId: string | undefined) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.assignedTo = userId;
    }
  }

  updateConversationStatus(conversationId: string, status: ConversationStatus) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.status = status;
    }
  }
}

export const store = new MockStore();

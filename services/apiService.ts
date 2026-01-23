
import { Conversation, Message, User, Contact, Complaint } from '../types';

// المسار التلقائي للسيرفر
const API_BASE_URL = '/api'; 

export const apiService = {
  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE_URL}/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(conversationId: string, text: string, type: string = 'text'): Promise<Message> {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, text, direction: 'OUTBOUND', type })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getContacts(): Promise<Contact[]> {
    const res = await fetch(`${API_BASE_URL}/contacts`);
    if (!res.ok) return [];
    return res.json();
  },

  async addContact(contact: Partial<Contact>): Promise<Contact> {
    const res = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    return res.json();
  }
};

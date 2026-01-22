
import { Conversation, Message, User, Contact } from '../types';

// بما أن التطبيق سيعمل على نفس الدومين، نستخدم المسار النسبي
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

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, text, direction: 'OUTBOUND' })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
  },

  async getContacts(): Promise<Contact[]> {
    const res = await fetch(`${API_BASE_URL}/contacts`);
    return res.json();
  }
};

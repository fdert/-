
import { WhatsAppConfig } from '../types';

export class WhatsAppGateway {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  /**
   * Sends a message (text + optional file) using the specified multipart API format.
   */
  async sendMessage(to: string, message: string, file?: File | string) {
    const formData = new FormData();
    formData.append('appkey', this.config.appKey);
    formData.append('authkey', this.config.authKey);
    formData.append('to', to);
    formData.append('message', message);

    if (file) {
      if (typeof file === 'string') {
        formData.append('file', file); // Treating string as URL
      } else {
        formData.append('file', file); // Actual uploaded file
      }
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/public/api/create-message`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  async testConnection(testNumber: string) {
    return this.sendMessage(testNumber, "اختبار اتصال نظام ArCRM WhatsApp بنجاح! ✅");
  }
}

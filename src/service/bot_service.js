import axios from 'axios';

const API_BASE_URL = 'https://ai-chatbot-fastapi.onrender.com';

class ChatService {
  async sendMessageToAI(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }
}

const chatService = new ChatService();
export default chatService;

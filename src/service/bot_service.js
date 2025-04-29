import axios from 'axios';

const API_BASE_URL = 'https://ai-chatbot-fastapi.onrender.com'; 

class ApiService {
  async sendMessageToAI(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
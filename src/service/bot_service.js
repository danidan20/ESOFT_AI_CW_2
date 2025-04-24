import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; 

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
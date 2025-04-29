import axios from 'axios';

const API_BASE_URL = 'https://ai-chatbot-fastapi.onrender.com';

class BotAdminService {
  async sendMessageToAI(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }

  async teachMe(question, answer) {
    try {
      const response = await axios.post(`${API_BASE_URL}/teachme/`, { question, answer });
      return response.data;
    } catch (error) {
      console.error('Error teaching the bot:', error);
      throw error;
    }
  }

  async getLearnedResponses() {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachme/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learned responses:', error);
      throw error;
    }
  }

  async getDynamicFacts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dynamic-facts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dynamic facts:', error);
      throw error;
    }
  }

  async addDynamicFact(fact_type, fact_value) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/dynamic-facts`, { fact_type, fact_value });
      return response.data;
    } catch (error) {
      console.error('Error adding dynamic fact:', error);
      throw error;
    }
  }

  async deleteAllDynamicFacts() {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/dynamic-facts`);
      return response.data;
    } catch (error) {
      console.error('Error deleting all dynamic facts:', error);
      throw error;
    }
  }

  async deleteDynamicFactsByType(fact_type) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/dynamic-facts/${fact_type}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dynamic facts of type ${fact_type}:`, error);
      throw error;
    }
  }

  async deleteLearnedResponse(question) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/learned-responses/${question}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting learned response for question "${question}":`, error);
      throw error;
    }
  }

  async getStaticFacts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/static-facts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching static facts:', error);
      throw error;
    }
  }

  async addStaticFact(pattern, response) {
    try {
      const axiosResponse = await axios.post(`${API_BASE_URL}/admin/static-facts`, { pattern, response });
      return axiosResponse.data;
    } catch (error) {
      console.error('Error adding static fact:', error);
      throw error;
    }
  }

  async updateStaticFact(pattern, newPattern, newResponse) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/static-facts/${pattern}`, { pattern: newPattern, response: newResponse });
      return response.data;
    } catch (error) {
      console.error(`Error updating static fact with pattern "${pattern}":`, error);
      throw error;
    }
  }

  async deleteStaticFact(pattern) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/static-facts/${pattern}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting static fact with pattern "${pattern}":`, error);
      throw error;
    }
  }
}

const botAdminService = new BotAdminService();
export default botAdminService;
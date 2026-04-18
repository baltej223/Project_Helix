import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const getHealth = async () => {
  const response = await api.get('/');
  return response.data;
};

// Placeholder for contract analysis API
export const analyzeContract = async (formData) => {
  const response = await api.post('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;

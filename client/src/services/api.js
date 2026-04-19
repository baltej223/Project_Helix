import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// ─── Health ───
export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const uploadDocument = async (file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data; // { status, data: { documentId, extractedText, cleanedText, metadata, pii } }
};

export const classifyDocument = async (documentId) => {
  const response = await api.post(`/documents/${documentId}/classify`);
  return response.data;
};

export const confirmClassification = async (documentId, domain, userParty) => {
  const response = await api.post(`/documents/${documentId}/confirm`, {
    domain,
    userParty,
  });
  return response.data;
};

export const uploadPdfToServer = async (documentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/documents/${documentId}/pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchPdfAsArrayBuffer = async (documentId) => {
  const response = await api.get(`/documents/${documentId}/pdf`, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await api.get(`/processing-jobs/${jobId}`);
  return response.data;
};

export const getClauses = async (jobId) => {
  const response = await api.get(`/processing-jobs/${jobId}/clauses`);
  return response.data;
};

export const getJobSummary = async (jobId) => {
  const response = await api.get(`/processing-jobs/${jobId}/summary`);
  return response.data;
};

export const getClauseDetails = async (jobId, clauseIndex) => {
  const response = await api.get(`/processing-jobs/${jobId}/clauses/${clauseIndex}`);
  return response.data;
};

export default api;

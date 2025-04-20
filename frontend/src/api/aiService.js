import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ai";

export const startSession = async () => {
  const response = await axios.post(`${API_BASE_URL}/start`);
  return response.data.sessionId;
};

export const sendMessage = async (sessionId, userMessage) => {
  const response = await axios.post(`${API_BASE_URL}/chat`, { sessionId, userMessage });
  return response.data;
};

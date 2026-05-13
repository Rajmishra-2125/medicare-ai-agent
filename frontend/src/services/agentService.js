import api from "./api";

const AGENT_URL = "/agent";

export const chatWithAgent = async (message, chatHistory) => {
  const response = await api.post(`${AGENT_URL}/chat`, {
    message,
    chatHistory
  });
  return response.data;
};

const agentService = {
  chatWithAgent
};

export default agentService;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import agentService from "../../services/agentService";

export const sendChatMessage = createAsyncThunk(
  "agent/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const history = state.agent.chatHistory;
      
      const response = await agentService.chatWithAgent(messageData, history);
      return response.data.message;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  chatHistory: [
    { role: "assistant", text: "Hello! I am MediBot, your AI Healthcare Assistant. I can help you find doctors and book available appointments instantly. How can I assist you today?" }
  ],
  isLoading: false,
  isError: false,
  message: "",
  isOpen: false // To toggle chat widget
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    toggleAgentChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addUserMessage: (state, action) => {
      state.chatHistory.push({ role: "user", text: action.payload });
    },
    clearHistory: (state) => {
      state.chatHistory = [initialState.chatHistory[0]];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatHistory.push({ role: "assistant", text: action.payload });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.chatHistory.push({ role: "assistant", text: `⚠️ System Error: ${action.payload}. Please verify backend terminal logs.` });
      });
  }
});

export const { toggleAgentChat, addUserMessage, clearHistory } = agentSlice.actions;
export default agentSlice.reducer;

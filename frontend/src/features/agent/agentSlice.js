import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch persisted chat history from backend ChatSession model
export const fetchChatHistory = createAsyncThunk(
  "agent/fetchHistory",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/agent/history");
      return response.data.data; // Array of UI formatted messages
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear persistent chat history on backend and reset UI state
export const clearPersistedChat = createAsyncThunk(
  "agent/clearPersistedChat",
  async (_, thunkAPI) => {
    try {
      await api.delete("/agent/history");
      thunkAPI.dispatch(clearHistory());
      return true;
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
    addAssistantMessagePlaceholder: (state) => {
      state.chatHistory.push({ role: "assistant", text: "" });
    },
    updateLastAssistantMessage: (state, action) => {
      const last = state.chatHistory[state.chatHistory.length - 1];
      if (last && last.role === "assistant") {
        last.text = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearHistory: (state) => {
      state.chatHistory = [initialState.chatHistory[0]];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.length > 0) {
          state.chatHistory = action.payload;
        }
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const {
  toggleAgentChat,
  addUserMessage,
  addAssistantMessagePlaceholder,
  updateLastAssistantMessage,
  setLoading,
  clearHistory
} = agentSlice.actions;

export default agentSlice.reducer;

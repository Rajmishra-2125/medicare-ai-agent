import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async Thunks for API Calls
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsReadThunk",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/notifications/mark-all-read");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "notifications/clearNotificationsThunk",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/notifications/clear");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear notifications");
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Receiver for real-time socket pushes
    addNotification: (state, action) => {
      state.items.unshift({
        id: action.payload._id || Date.now().toString(),
        title: action.payload.title || "New Notification",
        message: action.payload.message || action.payload,
        time: action.payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        type: action.payload.type || "general",
      });
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
            state.items = action.payload.notifications.map(sys => ({
                id: sys._id,
                title: sys.title,
                message: sys.message,
                time: new Date(sys.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isRead: sys.isRead,
                type: sys.type
            }));
            state.unreadCount = action.payload.unreadCount;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark All Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, isRead: true }));
        state.unreadCount = 0;
      })

      // Clear Notifications
      .addCase(clearNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

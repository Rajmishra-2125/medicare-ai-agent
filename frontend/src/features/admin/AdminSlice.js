import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService";

const initialState = {
  stats: null,
  users: [],
  doctors: [],
  appointments: [],
  slots: [],
  pagination: {
    users: null,
    doctors: null,
    appointments: null,
    slots: null,
  },
  isLoading: false,
  isChartLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  "admin/getStats",
  async (period, thunkAPI) => {
    try {
      return await adminService.getDashboardStats(period);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get all users
export const getAllUsers = createAsyncThunk(
  "admin/getUsers",
  async (params = {}, thunkAPI) => {
    try {
      return await adminService.getAllUsers(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get all doctors
export const getAllDoctors = createAsyncThunk(
  "admin/getDoctors",
  async (params = {}, thunkAPI) => {
    try {
      return await adminService.getAllDoctors(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get all appointments
export const getAllAppointments = createAsyncThunk(
  "admin/getAppointments",
  async (params = {}, thunkAPI) => {
    try {
      return await adminService.getAllAppointments(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get all slots
export const getAllSlots = createAsyncThunk(
  "admin/getSlots",
  async (params = {}, thunkAPI) => {
    try {
      return await adminService.getAllSlots(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Create slot
export const createSlot = createAsyncThunk(
  "admin/createSlot",
  async (slotData, thunkAPI) => {
    try {
      return await adminService.createSlot(slotData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Book appointment
export const bookAppointment = createAsyncThunk(
  "admin/bookAppointment",
  async (appointmentData, thunkAPI) => {
    try {
      return await adminService.bookAppointment(appointmentData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Reschedule appointment
export const rescheduleAppointment = createAsyncThunk(
  "admin/rescheduleAppointment",
  async ({ appointmentId, rescheduleData }, thunkAPI) => {
    try {
      return await adminService.rescheduleAppointment(
        appointmentId,
        rescheduleData,
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Create doctor
export const createDoctor = createAsyncThunk(
  "admin/createDoctor",
  async (doctorData, thunkAPI) => {
    try {
      return await adminService.createDoctor(doctorData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Approve doctor
export const approveDoctor = createAsyncThunk(
  "admin/approveDoctor",
  async (doctorId, thunkAPI) => {
    try {
      return await adminService.approveDoctor(doctorId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Reject doctor
export const rejectDoctor = createAsyncThunk(
  "admin/rejectDoctor",
  async (doctorId, thunkAPI) => {
    try {
      return await adminService.rejectDoctor(doctorId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Delete doctor
export const deleteDoctor = createAsyncThunk(
  "admin/deleteDoctor",
  async (doctorId, thunkAPI) => {
    try {
      return await adminService.deleteDoctor(doctorId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Delete patient
export const deletePatient = createAsyncThunk(
  "admin/deletePatient",
  async (userId, thunkAPI) => {
    try {
      return await adminService.deletePatient(userId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update user status
export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, statusData }, thunkAPI) => {
    try {
      return await adminService.updateUserStatus(userId, statusData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        // Only set the main isLoading to true if we don't have stats yet (initial load)
        if (!state.stats) {
          state.isLoading = true;
        }
        state.isChartLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isChartLoading = false;
        state.isSuccess = true;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isChartLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data.data;
        state.pagination.users = action.payload.data.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctors = action.payload.data.data;
        state.pagination.doctors = action.payload.data.pagination;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload.data.data;
        state.pagination.appointments = action.payload.data.pagination;
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllSlots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.slots = action.payload.data.data;
        state.pagination.slots = action.payload.data.pagination;
      })
      .addCase(getAllSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSlot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSlot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.slots.push(action.payload.data);
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.appointments.push(action.payload.data);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const index = state.appointments.findIndex(
          (apt) => apt._id === action.payload.data._id,
        );
        if (index !== -1) state.appointments[index] = action.payload.data;
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createDoctor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        // The backend returns { user, profile }
        state.doctors.push(action.payload.data.profile);
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const index = state.doctors.findIndex(
          (doc) => doc._id === action.payload.data._id,
        );
        if (index !== -1) state.doctors[index] = action.payload.data;
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const index = state.doctors.findIndex(
          (doc) => doc._id === action.payload.data._id,
        );
        if (index !== -1) state.doctors[index] = action.payload.data;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.doctors = state.doctors.filter(
          (doc) => doc._id !== action.payload.data._id,
        );
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.data._id,
        );
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        const index = state.users.findIndex(
          (user) => user._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;

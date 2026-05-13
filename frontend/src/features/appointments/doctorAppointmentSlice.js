import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  appointments: [],
  patients: [],
  prescriptions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Fetch Doctor's Appointments
export const fetchDoctorAppointments = createAsyncThunk(
  "doctorAppointments/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/appointments/doctor-appointments");
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch Doctor's Patients
export const fetchDoctorPatients = createAsyncThunk(
  "doctorAppointments/fetchPatients",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/doctors/patients");
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch Doctor's Prescriptions 
export const fetchDoctorPrescriptions = createAsyncThunk(
  "doctorAppointments/fetchPrescriptions",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/doctors/prescriptions");
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Appointment Status
export const updateDoctorAppointmentStatus = createAsyncThunk(
  "doctorAppointments/updateStatus",
  async ({ appointmentId, ...data }, thunkAPI) => {
    try {
      const response = await api.patch(`/appointments/${appointmentId}`, data);
      // Important to return the updated appointment to adjust it in the state array
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Email Prescription to Patient
export const emailPrescription = createAsyncThunk(
  "doctorAppointments/emailPrescription",
  async (appointmentId, thunkAPI) => {
    try {
      const response = await api.post(`/doctors/send-prescription/${appointmentId}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const doctorAppointmentSlice = createSlice({
  name: "doctorAppointments",
  initialState,
  reducers: {
    resetDoctorAppointments: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch flow
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments = action.payload?.data || action.payload || [];
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Patients Flow
      .addCase(fetchDoctorPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = action.payload?.data || action.payload || [];
      })
      .addCase(fetchDoctorPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Prescriptions Flow
      .addCase(fetchDoctorPrescriptions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.prescriptions = action.payload?.data || action.payload || [];
      })
      .addCase(fetchDoctorPrescriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Status Flow
      .addCase(updateDoctorAppointmentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDoctorAppointmentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Find existing index and mutate specific appointment 
        const updated = action.payload;
        if(updated) {
            const index = state.appointments.findIndex(app => app._id === updated._id);
            if (index !== -1) {
                state.appointments[index].status = updated.status;
            }
        }
      })
      .addCase(updateDoctorAppointmentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDoctorAppointments } = doctorAppointmentSlice.actions;
export default doctorAppointmentSlice.reducer;

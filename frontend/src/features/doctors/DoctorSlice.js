import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import doctorService from "../../services/doctorService";

const initialState = {
  doctors: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get all doctors
export const getAllDoctors = createAsyncThunk(
  "doctors/getAll",
  async (_, thunkAPI) => {
    try {
      return await doctorService.getAllDoctors();
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

// Search doctors by filters
export const searchDoctors = createAsyncThunk(
  "doctors/search",
  async (searchParams, thunkAPI) => {
    try {
      return await doctorService.searchDoctors(searchParams);
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

export const doctorSlice = createSlice({
  name: "doctor",
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
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctors = action.payload;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(searchDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.doctors = action.payload;
      })
      .addCase(searchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = doctorSlice.actions;
export default doctorSlice.reducer;

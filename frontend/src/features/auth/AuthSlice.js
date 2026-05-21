import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isAuthenticated: !!user,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
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

// Google Login user
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (tokenData, thunkAPI) => {
    try {
      return await authService.googleLogin(tokenData);
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

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, thunkAPI) => {
    try {
      return await authService.verifyOTP(otpData);
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

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Update user Address
export const updateProfileAddress = createAsyncThunk(
  "user/updateAddress",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateAddressDetails(userData);
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

// Update user profile details
export const updateUserPersonalDetails = createAsyncThunk(
  "user/updateProfileDetails",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateAccountDetails(userData);
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

// Update user avatar
export const updateUserAvatar = createAsyncThunk(
  "user/updateUserAvatar",
  async (formData, thunkAPI) => {
    try {
      return await authService.updateAvatar(formData);
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

// Change password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.changePassword(userData);
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

// Recover account
export const recoverAccount = createAsyncThunk(
  "auth/recoverAccount",
  async (userData, thunkAPI) => {
    try {
      return await authService.recoverAccount(userData);
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

// Delete account
export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (data, thunkAPI) => {
    try {
      return await authService.deleteAccount(data);
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

// Check Auth Status (Silent token verification)
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      // If we fail to get current user, session is dead. Clear user.
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(updateUserPersonalDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserPersonalDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Profile updated successfully";
      })
      .addCase(updateUserPersonalDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateProfileAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Address updated successfully";
      })
      .addCase(updateProfileAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Avatar updated successfully";
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isSuccess = true;
        state.message = "Account deleted successfully";
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(recoverAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(recoverAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message ||
          "Account recovered successfully. Please login.";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        // Don't set error message as it's a silent check
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

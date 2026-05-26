import api from "./api";

// Register user
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  return response.data.data;
};

// Google Login user
const googleLogin = async (tokenData) => {
  const response = await api.post("/auth/google", tokenData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }

  return response.data.data.user;
};

// Login user
const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }

  return response.data.data.user;
};

// Verify OTP
const verifyOTP = async (otpData) => {
  const response = await api.post("/auth/verify-otp", otpData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }

  return response.data.data.user;
};

// Logout user
const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed on server", error);
  }
  localStorage.removeItem("user");
  window.localStorage.setItem('logoutEvent', Date.now().toString());
};

// Update user details
const updateAccountDetails = async (userData) => {
  const response = await api.patch("/users/update-account-details", userData);

  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data.data;
};

// Updating account address
const updateAddressDetails = async (userData) => {
  const response = await api.patch("/users/update-account-address", userData);

  if (response.data) {
    // Ideally update local storage user if necessary, or rely on fetching current-user
    // For now, let's update the stored user if the response contains the updated user object
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data.data;
};

// Update user avatar
const updateAvatar = async (formData) => {
  const response = await api.patch("/users/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    // response.data.data should be the full user object with new avatar
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
  }

  return response.data.data;
};

// Change password
const changePassword = async (userData) => {
  const response = await api.patch("/users/change-password", userData);
  return response.data;
};

// Delete account
const deleteAccount = async (data) => {
  // data might contain password for confirmation
  const response = await api.delete("/users/delete-account", {
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  localStorage.removeItem("user");
  return response.data;
};

const recoverAccount = async (userData) => {
  const response = await api.post("/users/recover-account", userData);
  return response.data;
};

// Check current auth status silently
const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  if (response.data?.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }
  return response.data.data;
};

const authService = {
  register,
  logout,
  login,
  googleLogin,
  verifyOTP,
  updateAccountDetails,
  updateAddressDetails,
  updateAvatar,
  changePassword,
  deleteAccount,
  recoverAccount,
  getCurrentUser,
};

export default authService;

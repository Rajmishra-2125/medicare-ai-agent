import api from "./api";

const API_URL = "/admin";

// Get dashboard stats
const getDashboardStats = async (period = "week") => {
  const response = await api.get(`${API_URL}/dashboard-stats?period=${period}`);
  return response.data;
};

// Get all users
const getAllUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`${API_URL}/users${queryString ? `?${queryString}` : ""}`);
  return response.data;
};

// Get all doctors
const getAllDoctors = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`${API_URL}/doctors${queryString ? `?${queryString}` : ""}`);
  return response.data;
};

// Get all appointments
const getAllAppointments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`${API_URL}/appointments${queryString ? `?${queryString}` : ""}`);
  return response.data;
};

// Approve doctor
const approveDoctor = async (doctorId) => {
  const response = await api.patch(`${API_URL}/approve-doctor/${doctorId}`);
  return response.data;
};

// Reject doctor
const rejectDoctor = async (doctorId) => {
  const response = await api.patch(`${API_URL}/reject-doctor/${doctorId}`);
  return response.data;
};

// Delete patient
const deletePatient = async (userId) => {
  const response = await api.delete(`${API_URL}/delete-patient/${userId}`);
  return response.data;
};

// Update user status
const updateUserStatus = async (userId, statusData) => {
  const response = await api.patch(`${API_URL}/update-user-status/${userId}`, statusData);
  return response.data;
};

// Delete doctor
const deleteDoctor = async (doctorId) => {
  const response = await api.delete(`${API_URL}/delete-doctor/${doctorId}`);
  return response.data;
};

// Get all slots
const getAllSlots = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await api.get(`${API_URL}/slots${queryString ? `?${queryString}` : ""}`);
  return response.data;
};

// Create doctor
const createDoctor = async (doctorData) => {
  const response = await api.post(`${API_URL}/create-doctor`, doctorData);
  return response.data;
};

// Create slot
const createSlot = async (slotData) => {
  const response = await api.post(`${API_URL}/create-slot`, slotData);
  return response.data;
};

// Book appointment
const bookAppointment = async (appointmentData) => {
  const response = await api.post(`${API_URL}/book-appointment`, appointmentData);
  return response.data;
};

// Reschedule appointment
const rescheduleAppointment = async (appointmentId, rescheduleData) => {
  const response = await api.patch(`${API_URL}/reschedule-appointment/${appointmentId}`, rescheduleData);
  return response.data;
};

// Medical Records
const getAllMedicalRecords = async () => {
  const response = await api.get(`/medical-records`); // Base API URL already has /api/v1
  return response.data;
};

const uploadMedicalRecord = async (formData) => {
  const response = await api.post(`/medical-records/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const adminService = {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  getAllSlots,
  createDoctor,
  createSlot,
  bookAppointment,
  rescheduleAppointment,
  approveDoctor,
  rejectDoctor,
  deletePatient,
  deleteDoctor,
  updateUserStatus,
  getAllMedicalRecords,
  uploadMedicalRecord,
};

export default adminService;

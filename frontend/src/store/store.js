import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import doctorReducer from "../features/doctors/DoctorSlice";
import adminReducer from "../features/admin/AdminSlice";
import agentReducer from "../features/agent/agentSlice";
import doctorAppointmentReducer from "../features/appointments/doctorAppointmentSlice";
import notificationReducer from "../features/notifications/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    admin: adminReducer,
    agent: agentReducer,
    doctorAppointments: doctorAppointmentReducer,
    notifications: notificationReducer,
  },
});

store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState().notifications);
    localStorage.setItem("notificationsState", serializedState);
  } catch {
    // Ignore write errors
  }
});

export default store;

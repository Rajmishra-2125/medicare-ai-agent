import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Router,
  RouterProvider,
} from "react-router-dom";

import Services from './components/Services/Services.jsx'
import About from "./components/About/About.jsx";
import Contact from "./components/Contacts/Contact.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Doctors from "./components/Doctors/Doctors.jsx";
import Appointments from "./components/Appointments/Appointments.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx"; // Import ProtectedRoute
import RecoverAccount from "./components/Auth/RecoverAccount.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";

// Panel Pages
import AdminDasboard from './pannel/Admin/pages/AdminDashboard.jsx'
import ManageAppointment from './pannel/Admin/pages/ManageAppointment.jsx'
import ManageDoctor from './pannel/Admin/pages/ManageDoctor.jsx'
import ManagePatient from "./pannel/Admin/pages/ManagePatient.jsx";
import ManagePayment from "./pannel/Admin/pages/ManagePayment.jsx";
import ManageSettings from "./pannel/Admin/pages/ManageSettings.jsx";
import MedicalRecords from './pannel/Admin/pages/MedicalRecords.jsx'
import ManageAnalytics from './pannel/Admin/pages/ManageAnalytics.jsx'

// Doctor Panel
import DoctorDashboard from './pannel/Doctor/pages/Dashboard.jsx'

// Patient Panel
import PatientDashboard from "./pannel/Patient/pages/PatientDashboard.jsx";
import Profile from './pannel/Patient/pages/Profile.jsx'
import MyAppointments from './pannel/Patient/pages/MyAppointment.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="recover-account" element={<RecoverAccount />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="services" element={<Services />} />

      {/* Admin Panel Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="admin/dashboard" element={<AdminDasboard />} />
        <Route
          path="admin/manage-appointments"
          element={<ManageAppointment />}
        />
        <Route path="admin/manage-doctors" element={<ManageDoctor />} />
        <Route path="admin/manage-patients" element={<ManagePatient />} />
        <Route path="admin/manage-payments" element={<ManagePayment />} />
        <Route path="admin/settings" element={<ManageSettings />} />
        <Route
          path="admin/manage-medical-records"
          element={<MedicalRecords />}
        />
        <Route path="admin/manage-analytics" element={<ManageAnalytics />} />
      </Route>

      {/* Doctor Panel Routes */}
      <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
        <Route path="doctor/dashboard" element={<DoctorDashboard />} />
      </Route>

      {/* Patient Panel Routes */}
      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route path="" element={<PatientDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-appointments" element={<MyAppointments />} />
      </Route>
      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" reverseOrder={false} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);

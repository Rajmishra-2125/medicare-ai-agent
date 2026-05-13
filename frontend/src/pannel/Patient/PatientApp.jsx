import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy Loaded Patient Panel Pages
const PatientDashboard = lazy(() => import("./pages/PatientDashboard.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const MyAppointments = lazy(() => import("./components/Appointments/MyAppointments.jsx"));
const PatientSettings = lazy(() => import("./components/Settings/Settings.jsx"));
const PaymentPage = lazy(() => import("./pages/PaymentPage.jsx"));
const Doctors = lazy(() => import("./components/Doctors/Doctors.jsx"));
const Appointments = lazy(() => import("./components/Appointments/Appointments.jsx"));

// Note: Ensure that paths align with Sidebar links
const PatientApp = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <Routes>
      <Route path="home" element={<PatientDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="appointments" element={<MyAppointments />} />
      <Route path="book-appointment" element={<Appointments />} />
      <Route path="payment/:appointmentId" element={<PaymentPage />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="my-appointments" element={<MyAppointments />} />
      <Route path="settings" element={<PatientSettings />} />
      
      {/* Catch-all to default to the dashboard */}
      <Route path="" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PatientApp;

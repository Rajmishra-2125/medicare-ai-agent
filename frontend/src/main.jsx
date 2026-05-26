import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Core Public & Auth Pages (Immediate Load)
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx"; // Import ProtectedRoute
import NotFound from "./components/NotFound/NotFound.jsx";
import PageLoader from "./components/skeletons/PageLoader.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";

// Lazy Loaded Auxiliary Public Pages
const About = lazy(() => import("./components/About/About.jsx"));
const Contact = lazy(() => import("./components/Contacts/Contact.jsx"));
const Doctors = lazy(() => import("./components/Doctors/Doctors.jsx"));
const Services = lazy(() => import("./components/Services/Services.jsx"));
const Appointments = lazy(
  () => import("./components/Appointments/Appointments.jsx"),
);
const RecoverAccount = lazy(
  () => import("./components/Auth/RecoverAccount.jsx"),
);
const ForgotPassword = lazy(
  () => import("./components/Auth/ForgotPassword.jsx"),
);
const ResetPassword = lazy(() => import("./components/Auth/ResetPassword.jsx"));
const EmailVerification = lazy(
  () => import("./components/Auth/EmailVerification.jsx"),
);
const PrivacyPolicy = lazy(() => import("./components/Legal/PrivacyPolicy.jsx"));
const TermsOfService = lazy(() => import("./components/Legal/TermsOfService.jsx"));
const CookiePolicy = lazy(() => import("./components/Legal/CookiePolicy.jsx"));

// Lazy Loaded Role Apps
const AdminApp = lazy(() => import("./pannel/Admin/AdminApp"));
const DoctorApp = lazy(() => import("./pannel/Doctor/DoctorApp"));
const PatientApp = lazy(() => import("./pannel/Patient/PatientApp"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="services" element={<Services />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify-email" element={<EmailVerification />} />
      <Route path="recover-account" element={<RecoverAccount />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms" element={<TermsOfService />} />
      <Route path="cookies" element={<CookiePolicy />} />
      <Route path="cookie-policy" element={<CookiePolicy />} />

      {/* Role-Based Panel Apps */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="admin/*" element={<AdminApp />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
        <Route path="doctor/*" element={<DoctorApp />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
        <Route path="patient/*" element={<PatientApp />} />
      </Route>
      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import * as Sentry from "@sentry/react";

// Initialize Sentry for Error Tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// You will need to add VITE_GOOGLE_CLIENT_ID to your frontend .env file
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// The PageLoader has been replaced by the rich GlobalSkeleton

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Suspense fallback={<PageLoader />}>
              <Sentry.ErrorBoundary fallback={<ErrorScreen />}>
                <RouterProvider router={router} />
              </Sentry.ErrorBoundary>
            </Suspense>
            <Toaster position="top-center" reverseOrder={false} />
          </GoogleOAuthProvider>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);

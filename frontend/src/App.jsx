import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout";

// Panel Layouts
import AdminLayout from "./pannel/Admin/layout/AdminLayout";
import DoctorLayout from "./pannel/Doctor/layout/DoctorLayout";
import PatientLayout from "./pannel/Patient/layout/PatientLayout";
import DynamicMetadata from "./components/shared/DynamicMetadata.jsx";
import ScrollToTop from "./components/shared/ScrollToTop.jsx";
import { fetchNotifications } from "./features/notifications/notificationSlice.js";
import PageLoader from "./components/skeletons/PageLoader.jsx";

/**
 * App component acting as a dynamic layout switcher.
 * It selects the appropriate layout based on the user's role
 * and renders the matched child route via <Outlet />.
 */
function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Only fetch notifications for fully authenticated users (not in OTP phase)
    if (user && !user.isOTP) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

  if (user && !user.isOTP) {
    // Restrict Admin and Doctor strictly to their own routes
    if (user.role === "ADMIN" && !location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "DOCTOR" && !location.pathname.startsWith("/doctor")) {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    // Redirect root path for PATIENT
    if (location.pathname === "/") {
      if (user.role === "PATIENT")
        return <Navigate to="/patient/home" replace />;
    }
  } else if (location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  // Default to public layout if not fully logged in
  if (!user || user.isOTP) {
    return (
      <Layout>
        <ScrollToTop />
        <DynamicMetadata />
        <React.Suspense fallback={<PageLoader />}>
          <Outlet />
        </React.Suspense>
      </Layout>
    );
  }

  // Select Layout based on role
  let LayoutComponent;
  switch (user.role) {
    case "ADMIN":
      LayoutComponent = AdminLayout;
      break;
    case "DOCTOR":
      LayoutComponent = DoctorLayout;
      break;
    case "PATIENT":
      LayoutComponent = PatientLayout;
      break;
    default:
      LayoutComponent = Layout;
  }

  return (
    <LayoutComponent>
      <ScrollToTop />
      <DynamicMetadata />
      <React.Suspense fallback={<PageLoader />}>
        <Outlet />
      </React.Suspense>
    </LayoutComponent>
  );
}

export default App;

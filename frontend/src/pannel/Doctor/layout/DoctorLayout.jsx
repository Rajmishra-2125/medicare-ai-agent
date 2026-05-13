import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

function DoctorLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorSidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("doctorSidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 flex flex-col">
          <div className="flex-1 p-6">{children || <Outlet />}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default DoctorLayout;

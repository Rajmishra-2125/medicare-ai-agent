import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function Layout({ children }) {
  return (
    <>
      <Header />
      {children || <Outlet />}
      <Footer />
    </>
  );
}

export default Layout;

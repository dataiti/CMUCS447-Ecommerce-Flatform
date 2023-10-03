import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="w-full h-full bg-slate-100">
      <Header />
      <div className="pt-[140px] mx-auto w-[80%]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;

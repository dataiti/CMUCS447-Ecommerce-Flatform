import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const CartLayout = () => {
  return (
    <div className="w-full h-screen bg-slate-100">
      <Header />
      <div className="pt-[140px] mx-auto w-[80%] h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default CartLayout;

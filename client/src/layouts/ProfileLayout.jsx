import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SidebarProfile from "../components/SidebarProfile";
import { profileSidebarItem } from "../utils/constant";

const ProfileLayout = () => {
  return (
    <div className="w-full h-full bg-gray-100">
      <Header />
      <div className="pt-[90px] bg-slate-100">
        <div className="w-[80%] mx-auto">
          <div className="grid grid-cols-7 gap-4 pt-14 pb-5">
            <div className="col-span-2 bg-white p-6 rounded-md shadow-md h-[462px]">
              <SidebarProfile profileSidebarItem={profileSidebarItem} />
            </div>
            <div className="col-span-5 h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileLayout;

import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import { profileSidebarMyStoreItem } from "../utils/constant";
import SidebarDashBoard from "../components/SidebarDashBoard";

const StoreLayout = () => {
  const { id } = useParams();

  return (
    <div className="w-full h-full bg-gray-100">
      <Header className="w-[95%]" />
      <div className="pt-[90px] bg-slate-100 min-h-screen">
        <SidebarDashBoard
          sidebarItem={profileSidebarMyStoreItem}
          id={id}
          className="bg-primary-500"
        />
        <div className="pl-[18%]">
          <div className="px-[60px] py-[20px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLayout;

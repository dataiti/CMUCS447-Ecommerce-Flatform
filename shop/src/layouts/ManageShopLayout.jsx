import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { authSelect } from "../redux/features/authSlice";

const ManageShopLayout = () => {
  const { userInfo, isLoggedIn } = useSelector(authSelect);

  return (
    <div className="grid grid-cols-6 bg-slate-200/80 h-screen">
      <div className="col-span-1 bg-slate-700 min-h-screen">
        <Sidebar id={userInfo?.storeId} />
      </div>
      <Header isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <div className="col-span-5 flex flex-col ml-5 pt-[70px] h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageShopLayout;

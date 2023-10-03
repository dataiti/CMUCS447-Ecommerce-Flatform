import React, { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { dashboardSidebarItem } from "../utils/constant";
import logo from "../assets/logo3.png";
import { icons } from "../utils/icons";
import Button from "./Button";
import { authSelect, logoutThunkAction } from "../redux/features/authSlice";
import Loading from "./Loading";

const Sidebar = ({ className = "", id = "" }) => {
  const [loading, setIsLoading] = useState();

  const { isLoggedIn } = useSelector(authSelect);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(logoutThunkAction())
      .unwrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className={`min-h-screen w-[18%] bg-sidebar-500 fixed z-20 ${className}`}
    >
      {loading && <Loading />}
      <div className="px-5 flex items-center flex-col gap-2 py-4">
        <img
          src={logo}
          alt=""
          className="h-[120px] rounded-full border-4 border-slate-500"
        />
        <div className="flex flex-col items-center">
          <span className="text-white font-extrabold">CLICK ECOMMERCE</span>
          <span className="text-gray-200 text-sm">Admin System</span>
        </div>
      </div>
      <ul className="w-full">
        {dashboardSidebarItem.map((item, index) => {
          return (
            <li key={index} className="">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-white py-3 pl-8 pr-4 text-xs font-extrabold bg-teal-900 border-l-4 border-white"
                    : "flex items-center gap-3 text-gray-300 py-3 pl-8 pr-4 text-xs font-bold border-l-4 border-transparent"
                }
              >
                <span className="text-sm p-2 bg-slate-500 rounded-md text-white">
                  {item.icon}
                </span>
                <span className="text-sm">{item.display}</span>
              </NavLink>
            </li>
          );
        })}
        <div className="w-full px-5 py-2 flex items-center justify-between absolute bottom-0">
          <Button
            outline
            className="w-full rounded-full border-white text-white hover:bg-emerald-900"
            onClick={handleLogout}
          >
            Đăng Xuất
          </Button>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;

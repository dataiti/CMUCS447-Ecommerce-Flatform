import React, { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { profileSidebarMyStoreItem } from "../utils/constant";
import logo from "../assets/logo6.png";
import { icons } from "../utils/icons";
import Button from "./Button";
import { authSelect, logoutAction } from "../redux/features/authSlice";
import Loading from "./Loading";

const Sidebar = ({ className = "", id = "" }) => {
  const [loading, setIsLoading] = useState();

  const { isLoggedIn } = useSelector(authSelect);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(logoutAction())
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
    <div className={`min-h-screen w-[18%] bg-white fixed z-20 ${className}`}>
      {loading && <Loading />}
      <div className="px-5 flex items-center justify-between border-b-2 border-r border-gray-200">
        <div className="flex items-center">
          <img src={logo} alt="" className="h-[70px] rounded-md" />
          <div className="flex flex-col">
            <span className="text-gray-900 font-extrabold">CLICK SHOP</span>
            <span className="text-gray-500 text-sm">Manage my Shop</span>
          </div>
        </div>
        <span className="text-gray-500 cursor-pointer">
          <icons.AiOutlineMenu size={24} />
        </span>
      </div>
      <ul className="w-full py-10">
        {profileSidebarMyStoreItem.map((item, index) => {
          return (
            <li key={index} className="">
              <NavLink
                to={`${!id ? item.path : item.path + "/" + id}`}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-4 text-slate-700 py-4 pl-8 pr-4 text-xs font-extrabold bg-slate-300 border-r-4 border-primary-500"
                    : "flex items-center gap-4 text-slate-600 py-4 pl-8 pr-4 text-xs font-bold"
                }
              >
                <span className="text-sm p-2 bg-slate-200 rounded-md text-slate-600">
                  {item.icon}
                </span>
                <span className="text-sm">{item.display}</span>
              </NavLink>
            </li>
          );
        })}
        <div className="w-full px-5 py-2 flex items-center justify-between border-t-2 border-gray-200 absolute bottom-0">
          <Button
            primary
            className="w-full rounded-full"
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

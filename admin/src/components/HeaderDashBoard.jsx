import React from "react";
import { useSelector } from "react-redux";
import { authSelect } from "../redux/features/authSlice";
import { icons } from "../utils/icons";
import Avatar from "./Avatar";

const HeaderDashBoard = () => {
  const { userInfo, isLoggedIn } = useSelector(authSelect);

  return (
    <div className="flex-1 ">
      <div className="w-[80%] mx-auto flex items-center ">
        <div className="flex items-center gap-2 ">
          <div className="text-sm font-bold text-gray-500 flex flex-col">
            <span className="text-end">{userInfo?.username}</span>
            <span className="text-end">{userInfo?.email}</span>
          </div>
          <Avatar src={userInfo?.avatar} alt="avatar" />
        </div>
      </div>
    </div>
  );
};

export default HeaderDashBoard;

import React, { memo } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { titleSelect } from "../redux/features/titleSlice";

const Header = ({ isLoggedIn = false, userInfo = {} }) => {
  const { title } = useSelector(titleSelect);

  return (
    <div className="h-[70px] w-full mx-auto flex items-center justify-between shadow-md fixed bg-white z-10">
      <div className="pl-[15%]">
        <h3 className="text-3xl ml-20 font-bold">{title}</h3>
      </div>
      {isLoggedIn ? (
        <Link
          to={`/profile/${userInfo?._id}`}
          className="flex items-center gap-2 mr-10 "
        >
          <div className="text-sm font-bold text-gray-500 flex flex-col">
            <span className="text-end">{userInfo?.username}</span>
            <span className="text-end">{userInfo?.email}</span>
          </div>
          <Avatar src={userInfo?.avatar} alt="avatar" />
        </Link>
      ) : (
        <div className="flex items-center gap-1 mr-5">
          <Button outline to="/register">
            Register
          </Button>
          <Button primary to="/login">
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(Header);

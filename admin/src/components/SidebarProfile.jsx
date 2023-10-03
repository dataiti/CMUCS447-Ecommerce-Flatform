import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { authSelect, logoutAction } from "../redux/features/authSlice";
import { profileSidebarItem } from "../utils/constant";
import { icons } from "../utils/icons";
import Button from "./Button";
import isLoading from "Loading";

const SidebarProfile = () => {
  const [isLoading, setIsisLoading] = useState(false);
  const { userInfo } = useSelector(authSelect);

  const dispatch = useDispatch();

  const handleLogout = () => {
    setIsisLoading(true);
    dispatch(logoutAction())
      .unwrap()
      .then(() => {
        setIsisLoading(false);
      })
      .catch(() => {
        setIsisLoading(false);
      });
  };

  return (
    <div className="">
      {isLoading && <isLoading />}
      <ul className="">
        <li className="">
          <NavLink
            to={`/profile/${userInfo?._id}`}
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-4 text-primary-500 font-extrabold bg-primary-200 shadow-md rounded-full p-4"
                : "flex items-center gap-4 text-gray-400 font-extrabold p-4"
            }
          >
            <span className="">
              <icons.FaUserCircle size={24} />
            </span>
            <span className="text-sm">Hồ Sơ</span>
          </NavLink>
        </li>
        {profileSidebarItem.map((item, index) => {
          return (
            <li key={index} className="">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-4 text-primary-500 font-extrabold bg-primary-200 shadow-md rounded-full p-4"
                    : "flex items-center gap-4 text-gray-400 font-extrabold p-4"
                }
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm">{item.display}</span>
              </NavLink>
            </li>
          );
        })}
        <Button primary className="w-full mt-5" onClick={handleLogout}>
          Đăng Xuất
        </Button>
      </ul>
    </div>
  );
};

export default memo(SidebarProfile);

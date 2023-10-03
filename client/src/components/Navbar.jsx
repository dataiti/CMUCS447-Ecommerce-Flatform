import React, { memo } from "react";
import { Link, NavLink } from "react-router-dom";
import { navbarItem } from "../utils/constant";

const Navbar = () => {
  return (
    <div className="w-full h-[30px] bg-slate-800">
      <ul className="h-full flex items-center gap-8 w-[80%] mx-auto">
        {navbarItem.map((nav, index) => {
          return (
            <li key={index}>
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-500 uppercase text-sm font-extrabold"
                    : "text-white uppercase text-sm font-extrabold"
                }
              >
                {nav.display}
              </NavLink>
            </li>
          );
        })}
        <li>
          <Link
            to="http://localhost:3001"
            target="_blank"
            className="text-white uppercase text-sm font-extrabold"
          >
            Kênh Bán Hàng
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default memo(Navbar);

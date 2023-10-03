import React from "react";
import { icons } from "../utils/icons";
import logo from "../assets/logo5.png";

const Footer = () => {
  return (
    <footer>
      <div className="w-full h-[2px] bg-slate-900 my-4"></div>
      <div className="w-full bg-black py-5">
        <div className="w-[80%] mx-auto grid grid-cols-5 text-gray-400">
          <div className="">
            <h2 className="text-white font-bold pb-4 text-xs">Nhóm 7</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li>Phạm Thanh Hậu</li>
              <li>Nguyễn Thành Đạt</li>
              <li>Lê Minh Trí</li>
              <li>Ngô Văn Vinh</li>
            </ul>
          </div>
          <div className="col-span-2">
            <h2 className="text-white font-bold pb-4 text-xs">Email</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li>phamthanhhau@dtu.edu.vn</li>
              <li>nguyendat16111210@gmail.com</li>
              <li>CLeminhtri2002@gmai.com</li>
              <li>Vinhngo240302@gmail.com</li>
            </ul>
          </div>
          <div className="col-span-1">
            <h2 className="text-white font-bold pb-4 text-xs">Số điện thoại</h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li>84+ 363407642</li>
              <li>84+ 788691936</li>
              <li>84+ 395967905</li>
              <li>84+ 354342295</li>
            </ul>
          </div>
          <div className="">
            <h2 className="text-white font-bold pb-4 text-xs">
              Công nghệ sử dụng
            </h2>
            <ul className="flex flex-col gap-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="text-green-500">
                  <icons.ImAndroid size={15} />
                </span>
                <span>Java Android</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">
                  <icons.GrNode size={15} />
                </span>
                <span>NodeJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500">
                  <icons.GrReactjs size={15} />
                </span>
                <span>ReactJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">
                  <icons.DiMongodb size={15} />
                </span>
                <span>MongoDB</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="">
                  <icons.SiExpress size={15} />
                </span>
                <span>ExpressJS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-500">
                  <icons.SiTailwindcss size={15} />
                </span>
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-4 flex items-center justify-center text-xs font-bold bg-zinc-900 text-white">
        Coppyright © 2023 All rights reserved | Design by NguyenDat 💗
      </div>
    </footer>
  );
};

export default Footer;

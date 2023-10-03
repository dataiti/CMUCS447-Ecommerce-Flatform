import React from "react";
import { icons } from "../../utils/icons";
import Button from "../../components/Button";

const PaymentSuccess = () => {
  return (
    <div className="h-[calc(100vh-200px)] w-full mb-10 flex flex-col gap-8">
      <div className="flex items-center justify-between pr-10">
        <h4 className="uppercase font-extrabold text-lg text-emerald-700">
          Thành Công
        </h4>
        <div className="relative h-[6px] w-[70%] bg-gray-300 rounded-full">
          <div className="absolute -top-[7px] left-[-30px] flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
              Giỏ Hàng
            </span>
          </div>
          <p className="h-[6px] w-[100%] bg-teal-600 rounded-full"></p>
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
              Thanh Toán
            </span>
          </div>
          <div className="absolute -top-[7px] -right-[35px] flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
              Chờ Xác Nhận
            </span>
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col bg-white gap-2 items-center justify-center rounded-sm shadow-sm border">
        <span className="text-green-500 p-10 bg-green-50 rounded-full border border-green-500">
          <icons.GoCheck size={100} />
        </span>
        <div className="flex items-center gap-2 flex-col">
          <p className="text-teal-600 uppercase font-bold">
            Đặt Hàng Thành Công
          </p>
          <p className="text-gray-400 text-sm">
            Vui lòng kiểm tra Email của bạn
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button primary to={"/"} className="py-1 px-4 rounded-full">
            Về Trang Chủ
          </Button>
          <Button primary to={"/cart"} className="py-1 px-4 rounded-full">
            Tiếp Tục Mua
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

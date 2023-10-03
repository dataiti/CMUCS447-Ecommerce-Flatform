import { icons } from "../utils/icons";

export const profileSidebarMyStoreItem = [
  {
    display: "Thống Kê",
    icon: <icons.IoStatsChart size={20} />,
    path: "/shop/dashboard",
  },
  {
    display: "Quản Lý Sản Phẩm",
    icon: <icons.BsTable size={20} />,
    path: "/shop/manage-products/all",
  },
  {
    display: "Quản Lý Đơn Hàng",
    icon: <icons.GoListOrdered size={20} />,
    path: "/shop/manage-orders/all",
  },

  {
    display: "Phân tích Dữ Liệu",
    icon: <icons.AiFillSetting size={20} />,
    path: "/shop/data-analysis",
  },
  {
    display: "Trang Trí Shop",
    icon: <icons.FaPaintBrush size={20} />,
    path: "/shop/decoration",
  },
  {
    display: "Chăm Sóc Khách Hàng",
    icon: <icons.FaFacebookMessenger size={20} />,
    path: "/shop/customer-care",
  },
  {
    display: "Hồ Sơ Shop",
    icon: <icons.FaStoreAlt size={20} />,
    path: "/shop/manage/profile",
  },
  {
    display: "Thiết Lập Shop",
    icon: <icons.AiFillSetting size={20} />,
    path: "/shop/setup",
  },
];

export const statusOrderNavbarItem = [
  {
    display: "Tất cả",
    value: "",
  },
  {
    display: "Chờ xác nhận",
    value: "Waiting Confirm",
  },
  {
    display: "Chờ lấy hàng",
    value: "Preparing Goods",
  },
  {
    display: "Đang giao",
    value: "Shipping",
  },
  {
    display: "Đà giao",
    value: "Delivered",
  },
  {
    display: "Đã hủy",
    value: "Cancelled",
  },
];

export const statusOrderSelectItem = [
  {
    display: "Xác nhận đơn hàng",
    value: "Preparing Goods",
  },
  {
    display: "Đang giao",
    value: "Shipping",
  },
  {
    display: "Đã giao",
    value: "Delivered",
  },
  {
    display: "Đã hủy",
    value: "Cancelled",
  },
];

export const statusOrder = [
  {
    name: "Waiting Confirm",
    value: (
      <p className="text-blue-500 text-xs font-bold px-4 py-1 bg-blue-100/70 rounded-sm flex items-center justify-center">
        Chờ xác nhận
      </p>
    ),
  },
  {
    name: "Reparing Goods",
    value: (
      <p className="text-yellow-500 text-xs font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
        Chờ lấy hàng
      </p>
    ),
  },
  {
    name: "Shipping",
    value: (
      <p className="text-black text-xs font-bold px-4 py-1 bg-zinc-100 rounded-sm flex items-center justify-center">
        Đang giao
      </p>
    ),
  },
  {
    name: "Delivered",
    value: (
      <p className="text-green-500 text-xs font-bold px-4 py-1 bg-green-50 rounded-sm flex items-center justify-center">
        Đã giao
      </p>
    ),
  },
  {
    name: "Cancelled",
    value: (
      <p className="text-red-500 text-xs font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
        Đã hủy
      </p>
    ),
  },
];

export const isPaidOrder = [
  {
    name: false,
    value: (
      <div className="text-red-500 font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center gap-2">
        Chưa thanh toán
        <span>
          <icons.IoCloseSharp />
        </span>
      </div>
    ),
  },
  {
    name: true,
    value: (
      <div className="text-green-500 bg-green-50 font-bold px-4 py-1  rounded-sm flex items-center gap-2">
        Đã thanh toán
        <span>
          <icons.IoCheckmarkSharp />
        </span>
      </div>
    ),
  },
];

export const menuChartAnalysis = [
  {
    key: "Hôm nay",
    value: "today",
  },
  {
    key: "Hôm qua",
    value: "yesterday",
  },
  {
    key: "Trong 7 ngày qua",
    value: "last7days",
  },
  {
    key: "Trong 30 ngày qua",
    value: "last30days",
  },
  {
    key: "Năm nay",
    value: "year",
  },
];

export const menuLevelAnalysis = [
  {
    key: "Theo doanh số",
    value: "revenue",
  },
  {
    key: "Theo số sản phẩm",
    value: "count",
  },
];

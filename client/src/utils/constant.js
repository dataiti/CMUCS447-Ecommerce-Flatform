import { icons } from "../utils/icons";

export const optionSortProductItem = [
  {
    display: "Giá tiền",
    value: "price",
  },
  {
    display: "Lượt mua",
    value: "sold",
  },
  {
    display: "Đánh giá",
    value: "rating",
  },
];

export const priceFilerBarItem = [
  {
    id: 1,
    display: "Dưới 100,000 đ",
    minPrice: 0,
    maxPrice: 100000,
  },
  {
    id: 2,
    display: "100,000 đ - 300,000 đ",
    minPrice: 100000,
    maxPrice: 300000,
  },
  {
    id: 3,
    display: "300,000 đ - 500,000 đ",
    minPrice: 300000,
    maxPrice: 500000,
  },
  {
    id: 4,
    display: "700,000 đ - 1,000,000 đ",
    minPrice: 700000,
    maxPrice: 1000000,
  },
  {
    id: 5,
    display: "1,000,000 đ - 2,000,000 đ",
    minPrice: 1000000,
    maxPrice: 2000000,
  },
  {
    id: 6,
    display: "2,000,000 đ - 5,000,000 đ",
    minPrice: 2000000,
    maxPrice: 5000000,
  },
  {
    id: 7,
    display: "5,000,000 đ - 10,000,000 đ",
    minPrice: 5000000,
    maxPrice: 10000000,
  },
  {
    id: 8,
    display: "Trên 10,000,000 đ",
    minPrice: 10000000,
  },
];

export const ratingItem = [
  {
    id: 1,
    count: 5,
    items: ["", "", "", "", ""],
  },
  {
    id: 2,
    count: 4,
    items: ["", "", "", ""],
  },
  {
    id: 3,
    count: 3,
    items: ["", "", ""],
  },
  {
    id: 4,
    count: 2,
    items: ["", ""],
  },
  {
    id: 5,
    count: 1,
    items: [""],
  },
];

export const profileSidebarItem = [
  {
    display: "Ngân Hàng",
    icon: <icons.RiBankCardFill size={24} />,
    path: "/profile/bank",
  },
  {
    display: "Địa Chỉ",
    icon: <icons.FaAddressCard size={24} />,
    path: "/profile/addresses",
  },
  {
    display: "Đổi Mật Khẩu",
    icon: <icons.ImKey size={24} />,
    path: "/profile/change-password",
  },
  {
    display: "Đơn Mua",
    icon: <icons.GoListOrdered size={24} />,
    path: "/profile/list-orders",
  },
];

export const navbarItem = [
  {
    display: "Trang Chủ",
    path: "/",
  },
  {
    display: "Danh Mục",
    path: "/categories",
  },
];

export const loyaltyProgramItem = [
  {
    display: "Miễn phí vận chuyển",
    subDisplay: "Tiết kiệm tới 25%",
    icon: <icons.FaShippingFast size={24} />,
  },
  {
    display: "Ưu đãi bất ngờ hàng ngày",
    subDisplay: "Tiết kiệm tới 25%",
    icon: <icons.FaUserFriends size={24} />,
  },
  {
    display: "Hỗ trợ 24/7",
    subDisplay: "Mua sắm với một chuyên gia",
    icon: <icons.FaHeadphonesAlt size={24} />,
  },
  {
    display: "Giá cả phải chăng",
    subDisplay: "Nhận giá nhà máy trực tiếp",
    icon: <icons.HiReceiptPercent size={24} />,
  },
  {
    display: "Thanh toán an toàn",
    subDisplay: "Thanh toán được bảo vệ 100%",
    icon: <icons.RiBankCardFill size={24} />,
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
      <p className="text-blue-500 font-bold px-4 py-1 bg-blue-100/70 rounded-sm flex items-center justify-center">
        Chờ xác nhận
      </p>
    ),
  },
  {
    name: "Reparing Goods",
    value: (
      <p className="text-yellow-500 font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
        Chờ lấy hàng
      </p>
    ),
  },
  {
    name: "Shipping",
    value: (
      <p className="text-black font-bold px-4 py-1 bg-zinc-100 rounded-sm flex items-center justify-center">
        Đang giao
      </p>
    ),
  },
  {
    name: "Delivered",
    value: (
      <p className="text-green-500 font-bold px-4 py-1 bg-green-50 rounded-sm flex items-center justify-center">
        Đã giao
      </p>
    ),
  },
  {
    name: "Cancelled",
    value: (
      <p className="text-red-500 font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
        Đã hủy
      </p>
    ),
  },
];

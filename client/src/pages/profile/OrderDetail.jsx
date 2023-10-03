import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrderApi, getDetailOrderApi } from "../../apis/order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { authSelect } from "../../redux/features/authSlice";
import { icons } from "../../utils/icons";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { covertToDate, numberWithCommas } from "../../utils/fn";
import { statusOrder } from "../../utils/constant";
import Modal from "../../components/Modal";
import Review from "../../components/Review";

const OrderDetail = () => {
  const [orderData, setOrderData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    const fetchOrderDetailApi = async (req, res) => {
      try {
        setIsLoading(true);
        const res = await getDetailOrderApi({
          orderId: id,
        });
        if (res && res.data) {
          setOrderData(res.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchOrderDetailApi();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: `Hủy đơn hàng # ...${id.slice(-4)}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Đồng ý, Hủy đơn hàng!",
      }).then(async (result) => {
        setIsLoading(true);
        if (result.isConfirmed) {
          const res = await cancelOrderApi({
            userId: userInfo?._id,
            orderId: id,
          });
          if (res.success) {
            toast.success(`Đã hủy đơn hàng # ...${id.slice(-4)}`);
            navigate("/profile/list-orders");
          }
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {isLoading && <Loading />}
      <div className="h-full col-span-3 bg-white p-3 border rounded-md flex flex-col gap-2">
        <h4 className="text-sm font-bold text-teal-600 flex items-center gap-2">
          <span className="text-indigo-500">
            <icons.IoShirtSharp size={20} />
          </span>{" "}
          Thông Tin Đơn Hàng
        </h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img
              src={orderData?.productId?.imagePreview}
              alt=""
              className="h-16 w-16 rounded-sm shadow-md border"
            />
            <div className="flex flex-col gap-1">
              <p className="text-blue-900 text-sm font-bold">
                {orderData?.productId?.name}
              </p>
              <div className="flex items-center gap-6">
                <p className="text-gray-400 text-sm font-semibold">
                  {orderData?.storeId?.name}
                </p>
                |
                <p className="text-gray-400 text-sm font-semibold">
                  {covertToDate(orderData?.createdAt)}
                </p>
              </div>
            </div>
          </div>
          {orderData?.optionStyle?.option1 &&
            orderData?.optionStyle?.option2 && (
              <div className="flex items-center gap-3">
                <span className="text-yellow-600 text-sm font-bold">
                  Phân loại:{" "}
                </span>
                <p className="text-gray-500 text-sm font-bold">
                  {orderData?.optionStyle?.option1} -{" "}
                  {orderData?.optionStyle?.option2}
                </p>
              </div>
            )}
          {orderData?.status && (
            <div className="flex items-center gap-3">
              <span className="text-yellow-600 text-sm font-bold">
                Trạng thái đơn hàng:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {
                  statusOrder.find(
                    (status) => status.name === orderData?.status
                  ).value
                }
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-sm font-bold">
              Phương thức Thanh toán:{" "}
            </span>
            <p className="text-gray-500 text-sm font-bold">
              {orderData?.paymentMethod}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-sm font-bold">
              Thanh toán:{" "}
            </span>
            <p className="text-gray-500 text-sm font-bold">
              {!orderData?.isPaid ? (
                <div className="text-red-500 font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center gap-2">
                  Chưa thanh toán
                  <span>
                    <icons.IoCloseSharp />
                  </span>
                </div>
              ) : (
                <div className="text-green-500 bg-green-50 font-bold px-4 py-1  rounded-sm flex items-center gap-2">
                  Đã thanh toán
                  <span>
                    <icons.IoCheckmarkSharp />
                  </span>
                </div>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className=" bg-zinc-200 p-3 rounded-sm">
            <div className="grid grid-cols-2 py-2 rounded-md">
              <span className="text-start text-sm  font-bold text-gray-500">
                Tổng sản phẩm
              </span>
              <span className="text-end text-lg font-bold text-yellow-600">
                {orderData?.quantity}
              </span>
            </div>
            <div className="grid grid-cols-3 py-2 rounded-md">
              <span className="text-start text-sm font-bold text-gray-500">
                Phí vận chuyển
              </span>
              <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                {numberWithCommas(Number(orderData?.shippingPrice))}
                <span className="ml-2 text-sm text-black"> VND</span>
              </span>
            </div>
            <div className="grid grid-cols-3 py-2 rounded-md">
              <span className="text-start text-sm font-bold text-gray-500">
                Tổng tiền
              </span>
              <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                {numberWithCommas(Number(orderData?.totalPrice))}{" "}
                <span className="ml-2 text-sm text-black"> VND</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t pt-2">
            {(orderData?.status === "Waiting Confirm" ||
              orderData?.status === "Preparing Goods") && (
              <Button
                primary
                className="bg-red-900 px-3 hover:bg-red-800"
                leftIcon={<icons.IoCloseSharp />}
                onClick={handleCancelOrder}
              >
                Hủy đơn hàng
              </Button>
            )}
            {orderData?.status === "Delivered" && (
              <Modal
                leftIcon={<icons.FaStar />}
                classNameBtn="bg-yellow-500 px-3 hover:bg-yellow-600"
                primary
                nameBtn="Đánh giá sản phẩm"
              >
                <Review
                  storeId={orderData?.storeId?._id}
                  orderId={orderData?._id}
                  authorId={userInfo?._id}
                  productId={orderData?.productId?._id}
                />
              </Modal>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <div className="bg-white p-3 border rounded-md flex flex-col gap-2">
          <h4 className="text-sm font-bold text-teal-600 flex items-center gap-2">
            <span className="text-indigo-500">
              <icons.FaUserCheck size={20} />
            </span>{" "}
            Khách Hàng
          </h4>
          <div className="flex items-center gap-2">
            <img
              src={orderData?.userId?.avatar}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-slate-900"
            />
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.userId?.displayName}
              </p>
              {orderData?.userId?.email && (
                <p className="text-gray-400 text-sm font-bold">
                  {orderData?.userId?.email}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-3 border rounded-md flex flex-col gap-2">
          <h4 className="text-sm font-bold text-teal-600 flex items-center gap-2">
            <span className="text-indigo-500">
              <icons.FaShippingFast size={20} />
            </span>{" "}
            Đơn Vị Vận Chuyển
          </h4>
          <div className="flex items-center gap-2">
            <img
              src={orderData?.deliveryId?.logo}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-slate-900"
            />

            <p className="text-gray-500 text-sm font-bold">
              {orderData?.deliveryId?.name}
            </p>
          </div>
        </div>
        <div className="bg-white p-3 border rounded-md flex flex-col gap-2">
          <h4 className="text-sm font-bold text-teal-600 flex items-center gap-2">
            <span className="text-indigo-500">
              <icons.FaAddressCard size={20} />
            </span>{" "}
            Địa Chỉ Giao Hàng
          </h4>
          <div className="flex items-center gap-2"></div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Quốc Gia:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.country}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Tỉnh/Thành Phố:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.province}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Quận/Huyện:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.district}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Phường/Xã:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.ward}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Địa chỉ chính xác:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.exactAddress}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Tên người nhận hàng:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.displayName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-yellow-600 text-sm font-bold">
                Số điện thoại:{" "}
              </span>
              <p className="text-gray-500 text-sm font-bold">
                {orderData?.shippingAddressId?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

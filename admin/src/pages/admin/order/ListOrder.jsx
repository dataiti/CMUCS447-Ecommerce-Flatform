import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../../utils/icons";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import {
  getOrderStatusForAdminThunkAction,
  orderSelect,
} from "../../../redux/features/orderSlice";
import Pagination from "../../../components/Pagination";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { statusOrder, statusOrderNavbarItem } from "../../../utils/constant";
import { covertToDate, numberWithCommas } from "../../../utils/fn";
import { authSelect } from "../../../redux/features/authSlice";

const List = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { id } = useParams();

  const dispatch = useDispatch();

  const { listOrders, totalPage } = useSelector(orderSelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Quản lý đơn hàng"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getOrderStatusForAdminThunkAction({
            orderBy,
            sortBy,
            q,
            limit,
            page,
            status,
            userId: userInfo?._id,
          })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    featchApi();
  }, [dispatch, orderBy, sortBy, q, limit, page, status, userInfo?._id]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  // const handleRemoveCategory = async (storeId, productId) => {
  //   try {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#0B5345 ",
  //       cancelButtonColor: "#A93226",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then(async (result) => {
  //       setIsLoading(true);
  //       if (result.isConfirmed) {
  //         await dispatch(removeProductThunkAction({ storeId, productId }));
  //         Swal.fire("Deleted! ", " The product has been deleted. ", " Success");
  //       }
  //       setIsLoading(false);
  //     });
  //   } catch (error) {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Fragment>
      <div className="mx-4 my-10">
        <div className="flex items-center justify-between bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
          <ul className="grid grid-cols-6 w-full px-2 py-2">
            {statusOrderNavbarItem.map((item, index) => {
              return (
                <li
                  className="col-span-1 text-gray-500 font-bold"
                  onClick={() => setStatus(item.value)}
                  key={index}
                >
                  <span
                    className={`py-1 px-2 cursor-pointer ${
                      status === item.value
                        ? "border-b-4 border-slate-900 text-slate-900 font-bold"
                        : ""
                    }`}
                  >
                    {item.display}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative overflow-x-auto shadow-md rounded-sm bg-white">
          <div className="p-2">
            <div className="p-1 rounded-sm w-full flex items-center  border border-gray-300 ">
              <span className="text-green-500 px-4">
                <icons.FiSearch size={24} />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                className="outline-none flex-1 p-1 h-full w-full placeholder:text-sm bg-transparent text-gray-500 text-sm"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left  text-gray-400 cursor-pointer">
            <thead className="text-xs border-b  text-gray-700 uppercase bg-slate-200">
              <tr>
                <th scope="col" className="px-3 py-3">
                  ID
                </th>
                <th scope="col" className="px-3 py-3">
                  sản phẩm
                </th>
                <th scope="col" className="px-3 py-3">
                  Khách Hàng
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Cửa hàng
                </th>
                <th scope="col" className="px-3 py-3">
                  Địa chỉ
                </th>
                <th scope="col" className="px-1 py-3">
                  Số lượng
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Tổng Giá tiền
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Trạng thái
                </th>
                <th scope="col" className="px-3 py-3">
                  Ngày đặt
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Thanh toán
                </th>
                <th scope="col" className="px-3 py-3 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            {loading ? (
              <Loading />
            ) : (
              <tbody>
                {listOrders?.length > 0 &&
                  listOrders.map((order, index) => {
                    return (
                      <tr
                        className="bg-white border-b hover:bg-gray-100 "
                        key={order?._id || index}
                      >
                        <td className="px-3 text-xs py-2 text-gray-500">
                          ... {order?._id.slice(-4)}
                        </td>

                        <td className="px-3 text-xs py-2 text-gray-500">
                          <img
                            src={order?.productId?.imagePreview}
                            alt=""
                            className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                          />
                        </td>
                        <td className="px-3 text-xs text-gray-500 py-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={order?.userId?.avatar}
                              alt=""
                              className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                            />
                            {(order?.userId?.displayName &&
                              order?.userId?.displayName.slice(0, 10) +
                                "...") ||
                              order?.userId?.email}
                          </div>
                        </td>
                        <td className="px-3 text-xs py-2 text-gray-500">
                          {order?.storeId?.name}
                        </td>
                        <td className="px-3 text-xs py-2 text-gray-500">
                          {order?.shippingAddressId?.province}
                        </td>
                        <td className="px-1 text-xs py-2 text-gray-500">
                          {order?.quantity}
                        </td>
                        <td className="px-3 text-xs py-2 text-gray-500">
                          <div className="font-bold text-yellow-700 text-xs">
                            {numberWithCommas(order?.totalPrice)}{" "}
                            <span className="text-xs text-black">VND</span>
                          </div>
                        </td>
                        <td className="px-3 text-xs py-2 text-gray-500">
                          {
                            statusOrder.find(
                              (status) => status.name === order?.status
                            ).value
                          }
                        </td>
                        <td className="px-3 py-2 text-gray-500 text-xs">
                          {covertToDate(order?.createdAt)}
                        </td>
                        <td className="px-3 text-xs py-2 text-gray-500">
                          <div className="text-gray-500 text-sm font-bold">
                            {!order?.isPaid ? (
                              <div className="text-red-500 font-bold px-4 py-1 bg-red-50 rounded-xs flex items-center gap-2">
                                Chưa thanh toán
                                <span>
                                  <icons.IoCloseSharp />
                                </span>
                              </div>
                            ) : (
                              <div className="text-green-500 bg-green-50 font-bold px-4 py-1  rounded-xs flex items-center gap-2">
                                Đã thanh toán
                                <span>
                                  <icons.IoCheckmarkSharp />
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className=" text-xs py-2 text-gray-500 flex items-center gap-1 justify-center">
                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                              to={`/shop/manage-orders/detail/${order?._id}`}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
          <Pagination
            totalPage={totalPage}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default List;

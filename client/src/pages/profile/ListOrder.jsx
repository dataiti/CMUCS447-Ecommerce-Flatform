import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../utils/icons";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import {
  getOrderStatusByUserThunkAction,
  orderSelect,
} from "../../redux/features/orderSlice";
import Pagination from "../../components/Pagination";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { covertToDate, numberWithCommas } from "../../utils/fn";
import { statusOrder, statusOrderNavbarItem } from "../../utils/constant";
import { authSelect } from "../../redux/features/authSlice";

const List = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { id } = useParams();

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);
  const { listOrders, totalPage } = useSelector(orderSelect);

  useEffect(() => {
    const featchApi = async () => {
      try {
        if (userInfo) {
          setIsLoading(true);
          await dispatch(
            getOrderStatusByUserThunkAction({
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
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    featchApi();
  }, [dispatch, orderBy, sortBy, q, limit, page, id, status]);

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
      <div className="">
        <div className="h-full flex items-center justify-between bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
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
        {listOrders?.length > 0 ? (
          <div className="relative overflow-x-auto shadow-md rounded-sm bg-white">
            <div className="p-2">
              <div className="p-1 rounded-sm w-full flex items-center  border border-gray-300 ">
                <span className="text-gray-400 px-4">
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
                    Số lượng đặt
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
                  <th scope="col" className="px-3 py-3">
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
                          <td className="px-3 text-sm py-2 text-gray-500">
                            ... {order?._id.slice(-4)}
                          </td>

                          <td className="px-3 text-sm py-2 text-gray-500">
                            <img
                              src={order?.productId?.imagePreview}
                              alt=""
                              className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                            />
                          </td>
                          <td className="px-3 text-sm py-2 text-gray-500">
                            {order?.quantity}
                          </td>
                          <td className="px-3 text-sm py-2 text-gray-500">
                            {numberWithCommas(order?.totalPrice)} VND
                          </td>
                          <td className="px-3 text-sm py-2 text-gray-500">
                            {
                              statusOrder.find(
                                (status) => status.name === order?.status
                              ).value
                            }
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-sm">
                            {covertToDate(order?.createdAt)}
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-sm">
                            {order?.isPaid
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </td>
                          <td className=" text-sm py-2 text-gray-500 flex items-center gap-1 justify-center">
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                                to={`/profile/order-detail/${order?._id}`}
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
        ) : (
          <div className="w-full h-[384px] bg-white border rounded-sm shadow-sm flex items-center flex-col gap-2 justify-center">
            <div className="h-1/2 bg-red-100/60 px-10 rounded-md flex flex-col gap-2 items-center justify-center">
              <span className="text-gray-500">
                <icons.MdOutlineDoNotDisturbAlt size={50} />
              </span>
              <p className="font-semibold text-gray-500 text-sm">
                Không tìm thấy đơn hàng nào
              </p>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default List;

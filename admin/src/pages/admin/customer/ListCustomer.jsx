import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../../utils/icons";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { authSelect } from "../../../redux/features/authSlice";
import { userStatusNavbarItem } from "../../../utils/constant";
import {
  getListUserForAdminThunkAction,
  userSelect,
} from "../../../redux/features/userSlice";

const ListCustomers = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setIsLoading] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();

  const { listCustomers, totalPage } = useSelector(userSelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Quản lý người dùng"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListUserForAdminThunkAction({
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
  }, [dispatch, orderBy, sortBy, q, limit, page, userInfo?._id, status]);

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
    <div className="px-[10px] mt-6 mx-5 py-6">
      <div className="flex items-center justify-between bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
        <ul className="grid grid-cols-6 w-full px-2 py-2">
          {userStatusNavbarItem.map((item, index) => {
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
              <th scope="col" className="px-6 py-3 text-center">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hình đại diện
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Tên hiển thị
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Số điện thoại
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Loại đăng nhập
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          {loading ? (
            <Loading />
          ) : (
            <tbody>
              {listCustomers?.length > 0 &&
                listCustomers.map((customer, index) => {
                  return (
                    <tr
                      className="bg-white border-b hover:bg-gray-100 "
                      key={customer?._id || index}
                    >
                      <td className="px-6 text-sm py-2 text-gray-500 text-center">
                        ... {customer?._id.slice(-4)}
                      </td>
                      <td className="px-6 text-sm py-2 text-center">
                        <img
                          src={customer?.avatar}
                          alt=""
                          className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                        />
                      </td>
                      <td className="px-6 py-2 text-teal-600 font-bold text-sm text-center">
                        {customer?.displayName
                          ? customer?.displayName.slice(0, 14) + "..."
                          : "Không"}
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 font-bold text-center">
                        {customer?.email ? customer?.email : "Không"}
                      </td>
                      <td className="px-6 text-sm text-gray-500 py-2 text-center">
                        {customer?.phone ? "+84" + customer?.phone : "Không"}
                      </td>
                      <td className="px-6 text-sm text-gray-500 py-2 text-center">
                        {customer.googleId && (
                          <div className="flex items-center gap-2 justify-center">
                            <span>
                              <icons.FcGoogle size={20} />
                            </span>
                            <p>Google</p>
                          </div>
                        )}
                        {customer.facebookId && (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="text-blue-500">
                              <icons.BsFacebook size={20} />
                            </span>
                            <p>Facebook</p>
                          </div>
                        )}
                        {!customer.facebookId && !customer.googleId && (
                          <div className="flex items-center gap-2 justify-center">
                            <p>Mặc Định</p>
                          </div>
                        )}
                      </td>
                      <td className=" text-sm py-2 text-gray-700 font-bold flex items-center gap-1 justify-center">
                        <Button
                          className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                          to={`/my-store/manage/`}
                        >
                          Xem chi tiết
                        </Button>
                        <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                          Xóa
                        </Button>
                        <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                          Cập Nhật
                        </Button>

                        {status === "Active" && (
                          <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                            Khóa
                          </Button>
                        )}
                        {status === "Banned" && (
                          <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                            Mở Khóa
                          </Button>
                        )}
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
  );
};

export default ListCustomers;

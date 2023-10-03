import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../../utils/icons";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import {
  getListProductsForAdminApiThunkAction,
  productSelect,
} from "../../../redux/features/productSlice";
import Pagination from "../../../components/Pagination";
import ContentRow from "../../../components/ContentRow";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { authSelect } from "../../../redux/features/authSlice";
import { covertToDate, numberWithCommas } from "../../../utils/fn";
import { comfirmNavbarItem } from "../../../utils/constant";
import {
  getListStoresForAdminThunkAction,
  storeSelect,
} from "../../../redux/features/storeSlice";

const ListProduct = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setIsLoading] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();

  const { listStores, totalPage } = useSelector(storeSelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Quản lý các cửa hàng"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListStoresForAdminThunkAction({
            orderBy,
            sortBy,
            q,
            limit,
            page,
            status,
            storeId: id,
            userId: userInfo?._id,
          })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    featchApi();
  }, [dispatch, orderBy, sortBy, q, limit, page, userInfo?._id, , status]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="px-[10px] mt-6 mx-4 py-6">
      <div className="flex items-center justify-between bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
        <ul className="grid grid-cols-6 w-full px-2 py-2">
          {comfirmNavbarItem.map((item, index) => {
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
                Logo
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Tên Shop
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Chủ SHop
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Vị trí
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Đánh giá
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Tham gia ngày
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
              {listStores?.length > 0 &&
                listStores.map((store, index) => {
                  return (
                    <tr
                      className="bg-white border-b hover:bg-gray-100 "
                      key={store?._id || index}
                    >
                      <td className="px-6 text-sm py-2 text-gray-500 text-center">
                        ... {store?._id.slice(-4)}
                      </td>

                      <td className="px-6 text-sm py-2 text-center">
                        <img
                          src={store?.avatar}
                          alt=""
                          className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                        />
                      </td>
                      <td className="px-6 py-2 text-teal-600 font-bold text-sm text-center">
                        {store?.name.slice(0, 14)} ...
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 font-bold text-center">
                        <div className="flex items-center gap-2">
                          <img
                            src={store?.ownerId?.avatar}
                            alt=""
                            className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                          />
                          {(store?.ownerId?.displayName &&
                            store?.ownerId?.displayName.slice(0, 10) + "...") ||
                            store?.ownerId?.email}
                        </div>
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 text-center">
                        {store?.location}
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 text-center">
                        {store?.rating}
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 text-center">
                        {covertToDate(store?.createdAt)}
                      </td>
                      <td className=" text-sm py-2 font-bold text-gray-700 text-center flex items-center gap-1 justify-center">
                        <Button
                          className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                          to={`/my-store/manage/`}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          className="bg-gray-200 text-xs px-2 hover:bg-gray-100"
                          to={`/my-store/manage/`}
                        >
                          Xóa
                        </Button>
                        <Button
                          className="bg-gray-200 text-xs px-2 hover:bg-gray-100"
                          to={`/my-store/manage/`}
                        >
                          Cập Nhật
                        </Button>

                        {status === "Pending" && (
                          <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                            Phê Duyệt
                          </Button>
                        )}
                        {status === "Active" && (
                          <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                            Cấm Bán
                          </Button>
                        )}
                        {status === "Banned" && (
                          <Button className="bg-gray-200 text-xs px-2 hover:bg-gray-100">
                            Mở Cấm Bán
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

export default ListProduct;

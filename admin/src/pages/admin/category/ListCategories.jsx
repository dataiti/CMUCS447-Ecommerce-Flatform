import React, { useEffect, useState } from "react";
import { icons } from "../../../utils/icons";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  categorySelect,
  getListCategoriesForAdminThunkAction,
  removeCategoryThunkAction,
} from "../../../redux/features/categorySlice";
import Pagination from "../../../components/Pagination";
import { authSelect } from "../../../redux/features/authSlice";
import { setTitleHeader } from "../../../redux/features/titleSlice";

const ListCategories = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { listCategories, totalPage } = useSelector(categorySelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Quản lý danh mục sản phẩm"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListCategoriesForAdminThunkAction({
            orderBy,
            sortBy,
            q,
            limit,
            page,
            userId: userInfo?._id,
          })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    featchApi();
  }, [dispatch, orderBy, sortBy, q, limit, page]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể hoàn nguyên điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Có, xóa nó!",
      }).then(async (result) => {
        setIsLoading(true);
        if (result.isConfirmed) {
          await dispatch(removeCategoryThunkAction(categoryId));
          Swal.fire("Đã xóa! ", " Sản phẩm đã được xóa. ", " Thành công ");
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-[140px] my-[50px]">
      <div className="flex items-center justify-between  bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
        <div className="w-2/3 flex items-center gap-3">
          <span className="text-sm  text-cyan-900">Sắp xếp: </span>
          <select
            id="small"
            className="outline-none p-2 text-sm text-gray-900 rounded-sm bg-gray-200 cursor-pointer"
            value={sortBy}
            onChange={() => setSortBy(sortBy != "_id" ? "_id" : "name")}
          >
            <option defaultValue value="_id">
              Mới nhất
            </option>
            <option value="name">Tên danh mục</option>
          </select>
          <span className="text-sm  text-cyan-900">Thứ tự: </span>
          <select
            id="small"
            className="outline-none p-2 text-sm text-gray-900 rounded-sm bg-gray-200 cursor-pointer"
            value={orderBy}
            onChange={() => setOrderBy(orderBy != "asc" ? "asc" : "desc")}
          >
            <option defaultValue value="asc" className="rounded-sm">
              Thấp đến cao
            </option>
            <option value="desc">Cao đến thấp</option>
          </select>
        </div>
        <div>
          <Button
            primary
            className="bg-emerald-800 text-xs px-4 hover:bg-emerald-900"
            leftIcon={<icons.AiFillPlusCircle size={20} />}
            to="/dashboard/categories/create"
          >
            Thêm Danh Mục
          </Button>
        </div>
      </div>
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
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Hình Ảnh
              </th>
              <th scope="col" className="px-6 py-3">
                Tên Danh Mục
              </th>
              <th scope="col" className="px-6 py-3">
                Số Lượng Sản Phẩm
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hành Động
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <Loading />
          ) : (
            <tbody>
              {listCategories?.length > 0 &&
                listCategories.map((category, index) => {
                  return (
                    <tr
                      className="bg-white border-b hover:bg-gray-100 "
                      key={category?._id || index}
                    >
                      <td className="px-6 text-sm py-2 text-gray-500">
                        ... {category?._id.slice(-4)}
                      </td>

                      <td className="px-6 text-sm py-2 text-gray-500">
                        <img
                          src={category?.image}
                          alt=""
                          className="h-10 w-10 rounded-md bg-slate-200"
                        />
                      </td>
                      <td className="px-6 text-sm py-2 text-teal-700 font-bold">
                        {category?.name}
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500">1</td>
                      <td className=" text-sm py-2 text-gray-500 flex items-center gap-1 justify-center">
                        <Button
                          className="bg-gray-200 text-xs px-4  hover:bg-slate-300"
                          onClick={() => handleRemoveCategory(category._id)}
                        >
                          Xóa
                        </Button>
                        <Button
                          className="bg-gray-200 text-xs px-4  hover:bg-slate-300"
                          to={`/dashboard/categories/update/${category._id}`}
                        >
                          Chỉnh sửa
                        </Button>
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

export default ListCategories;

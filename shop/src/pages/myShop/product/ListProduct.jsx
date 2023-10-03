import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../../utils/icons";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import {
  getListProductsByStoreThunkAction,
  productSelect,
  removeProductThunkAction,
} from "../../../redux/features/productSlice";
import Pagination from "../../../components/Pagination";
import ContentRow from "../../../components/ContentRow";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { authSelect } from "../../../redux/features/authSlice";
import { numberWithCommas } from "../../../utils/fn";

const ListProduct = () => {
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();

  const { listMyProducts, totalPage } = useSelector(productSelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Quản lý sản phẩm"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListProductsByStoreThunkAction({
            orderBy,
            sortBy,
            q,
            limit,
            page,
            // categoryId,
            // rating,
            // minPrice,
            // maxPrice,
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
  }, [dispatch, orderBy, sortBy, q, limit, page, id]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleRemoveCategory = async (storeId, productId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        setIsLoading(true);
        if (result.isConfirmed) {
          await dispatch(removeProductThunkAction({ storeId, productId }));
          Swal.fire("Deleted! ", " The product has been deleted. ", " Success");
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="px-[10px] mt-6 mx-20 py-8">
        <div className="flex items-center justify-between bg-white p-2 rounded-sm mb-5 gap-2 shadow-md">
          <div className="w-2/3 flex items-center gap-3">
            <span className="text-sm  text-cyan-900">Sắp xếp theo: </span>
            <select
              id="small"
              className="outline-none p-2 text-sm text-gray-900 rounded-sm bg-gray-200 cursor-pointer"
              value={sortBy}
              onChange={() => setSortBy(sortBy !== "_id" ? "_id" : "name")}
            >
              <option defaultValue value="_id">
                Mới nhất
              </option>
              <option value="name">Category name</option>
            </select>
            <span className="text-sm  text-cyan-900">Thứ tự theo: </span>
            <select
              id="small"
              className="outline-none p-2 text-sm text-gray-900 rounded-sm bg-gray-200 cursor-pointer"
              value={orderBy}
              onChange={() => setOrderBy(orderBy !== "asc" ? "asc" : "desc")}
            >
              <option defaultValue value="asc" className="rounded-sm">
                Thấp đến Cao
              </option>
              <option value="desc">Cao đến Thấp</option>
            </select>
          </div>
          <div>
            <Button
              primary
              className="bg-emerald-800 text-xs px-4 hover:bg-emerald-900"
              leftIcon={<icons.AiFillPlusCircle size={20} />}
              to={`/shop/manage/add-product/${id}`}
            >
              Thêm sản phẩm
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
                  Hình ảnh
                </th>
                <th scope="col" className="px-6 py-3">
                  Tên sản phẩm
                </th>
                <th scope="col" className="px-6 py-3">
                  Danh mục
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Giá tiền
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Đã bán
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Số lượng
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
                {listMyProducts?.length > 0 &&
                  listMyProducts.map((product, index) => {
                    return (
                      <tr
                        className="bg-white border-b hover:bg-gray-100 "
                        key={product?._id || index}
                      >
                        <td className="px-6 text-sm py-2 text-gray-500">
                          ... {product?._id.slice(-4)}
                        </td>

                        <td className="px-6 text-sm py-2 ">
                          <img
                            src={product?.imagePreview}
                            alt=""
                            className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                          />
                        </td>
                        <td className="px-6 py-2 text-teal-600 font-bold text-sm">
                          {product?.name.slice(0, 14)} ...
                        </td>
                        <td className="px-6 text-sm py-2 text-gray-500 font-bold">
                          {product?.categoryId?.name}
                        </td>
                        <td className="px-6 text-sm text-gray-500 py-2">
                          <div className="font-bold text-yellow-700 text-base">
                            {numberWithCommas(product?.price?.$numberDecimal)}{" "}
                            <span className="text-xs text-black">VND</span>
                          </div>
                        </td>
                        <td className="px-6 text-sm py-2 text-gray-500">
                          {product?.sold}
                        </td>
                        <td className="px-6 text-sm py-2 text-gray-500">
                          {product?.totalQuantity}
                        </td>
                        <td className=" text-sm py-2 text-gray-500 flex items-center gap-1 justify-center">
                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                              onClick={() =>
                                handleRemoveCategory(
                                  product?.storeId?._id,
                                  product?._id
                                )
                              }
                            >
                              Xóa
                            </Button>
                            <Button
                              className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                              to={`/my-store/manage/`}
                            >
                              Chỉnh sửa
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

export default ListProduct;

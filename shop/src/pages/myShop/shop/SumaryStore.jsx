import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getTodoListByStoreeApi,
  getRevenueLast7DaysApi,
  getRevenueByMonthApi,
  getTotalRevenueApi,
} from "../../../apis/revenue";
import DoughnutChart from "../../../components/DoughnutChart";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import VerticalBarChart from "../../../components/VerticalBarChart";
import { authSelect } from "../../../redux/features/authSlice";
import {
  getOrderStatusByStoreThunkAction,
  orderSelect,
} from "../../../redux/features/orderSlice";
import {
  getProfileStoreApiThunkAction,
  storeSelect,
} from "../../../redux/features/storeSlice";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { icons } from "../../../utils/icons";
import { statusOrder } from "../../../utils/constant";
import { covertToDate, numberWithCommas } from "../../../utils/fn";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import { getProfileStoreApi } from "../../../apis/store";

const SumaryStore = () => {
  const [todoList, setTodoList] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const [typeRevenue, setTypeRevenue] = useState("week");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profileStore, setProfileStore] = useState({});

  const dispatch = useDispatch();
  const { id } = useParams();

  const { userInfo } = useSelector(authSelect);
  const { storeProfile } = useSelector(storeSelect);
  const { listOrders, totalPage } = useSelector(orderSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Thống kê Shop"));
  }, [dispatch]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const res = await getProfileStoreApi({
          userId: userInfo?._id,
          storeId: id,
        });
        if (res && res.data) {
          setProfileStore(res.data);
        }

        const resTodoList = await getTodoListByStoreeApi({ storeId: id });
        if (resTodoList && resTodoList.data) {
          setTodoList(resTodoList.data);
        }
        if (typeRevenue === "week") {
          const resRevenue = await getRevenueLast7DaysApi({ storeId: id });
          if (resRevenue && resRevenue.data) {
            setRevenueData(resRevenue.data);
          }
        }
        if (typeRevenue === "month") {
          const resRevenue = await getRevenueByMonthApi({ storeId: id });
          setRevenueData(resRevenue.data);
        }
        await dispatch(
          getProfileStoreApiThunkAction({ userId: userInfo?._id, storeId: id })
        );
        await dispatch(
          getOrderStatusByStoreThunkAction({
            limit,
            status: "Waiting Confirm",
            storeId: id,
          })
        );

        const resTotalRevenue = await getTotalRevenueApi({ storeId: id });
        if (resTotalRevenue && resTotalRevenue.data) {
          setTotalRevenue(resTotalRevenue.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [typeRevenue, id]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="px-10 py-2 h-[calc(100vh-70px)]">
      {loading && <Loading />}
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-6 flex flex-col gap-2">
          <div className="grid grid-cols-5 gap-2">
            <div className="bg-white rounded-md h-20 flex flex-col gap-2 items-center justify-center">
              <span className="text-3xl font-bold text-green-700" key={0}>
                {todoList[1] ? todoList[1]?.count : 0}
              </span>
              <span className="text-sm text-gray-500 font-bold">
                Chờ xác nhận
              </span>
            </div>
            <div className="bg-white rounded-md h-20 flex flex-col gap-2 items-center justify-center">
              <span className="text-3xl font-bold text-green-700" key={1}>
                {todoList[4] ? todoList[4]?.count : 0}
              </span>
              <span className="text-sm text-gray-500 font-bold">
                Chờ lấy hàng
              </span>
            </div>
            <div className="bg-white rounded-md h-20 flex flex-col gap-2 items-center justify-center">
              <span className="text-3xl font-bold text-green-700" key={2}>
                {todoList[3] ? todoList[3]?.count : 0}
              </span>
              <span className="text-sm text-gray-500 font-bold">Đang giao</span>
            </div>
            <div className="bg-white rounded-md h-20 flex flex-col gap-2 items-center justify-center">
              <span className="text-3xl font-bold text-green-700" key={3}>
                {todoList[0] ? todoList[0]?.count : 0}
              </span>
              <span className="text-sm text-gray-500 font-bold">Đã xử lý</span>
            </div>
            <div className="bg-white rounded-md h-20 flex flex-col gap-2 items-center justify-center">
              <span className="text-3xl font-bold text-green-700" key={4}>
                {todoList[2] ? todoList[2]?.count : 0}
              </span>
              <span className="text-sm text-gray-500 font-bold">Đã hủy</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3 bg-white rounded-md py-2 px-4 w-full">
              <div className="flex items-center justify-between">
                <Label label="Biểu đồ doanh thu" />
                <select
                  id="small"
                  className="outline-none text-sm p-2 text-gray-900 rounded-sm bg-gray-200 cursor-pointer"
                  value={typeRevenue}
                  onChange={(e) => setTypeRevenue(e.target.value)}
                >
                  <option value="week" defaultValue>
                    Doanh thu 7 ngày gần nhất
                  </option>
                  <option value="month">Doanh thu các tháng trong năm</option>
                </select>
                <Button
                  to={`/shop/data-analysis/${id}`}
                  className="text-blue-500 text-sm font-bold"
                >
                  Xem thêm
                </Button>
              </div>
              <VerticalBarChart data={revenueData} />
            </div>
            <div className="col-span-2 bg-white rounded-md p-2 grid grid-cols-2 gap-1">
              <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
                <Label label="Tổng doanh thu" className="uppercase" />
                <div className="font-bold text-yellow-700 text-3xl">
                  {numberWithCommas(totalRevenue.totalRevenue / 1000) || 0}
                  <span className="text-lg text-black">K</span>
                </div>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
                <Label label="Năm hiện tại" className="uppercase" />
                <div className="font-bold text-yellow-700 text-3xl">
                  {numberWithCommas(totalRevenue.yearRevenue / 1000) || 0}
                  <span className="text-lg text-black">K</span>
                </div>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
                <Label label="Tháng hiện tại" className="uppercase" />
                <div className="font-bold text-yellow-700 text-3xl">
                  {numberWithCommas(totalRevenue.monthRevenue / 1000) || 0}
                  <span className="text-lg text-black">K</span>
                </div>
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
                <Label label="Hôm nay" className="uppercase" />
                <div className="font-bold text-yellow-700 text-3xl">
                  {numberWithCommas(totalRevenue.todayRevenue / 1000) || 0}
                  <span className="text-lg text-black">K</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-full col-span-1 bg-white rounded-md">
              <DoughnutChart data={revenueData} />
            </div>
            <div className="col-span-2 bg-white rounded-md p-2 flex flex-col gap-1">
              <Label label="Các đơn hàng mới" />
              <table className="w-full text-sm text-left  text-gray-400 cursor-pointer border border-gray-300">
                <thead className="text-xs border-b  text-gray-700 uppercase bg-slate-200">
                  <tr>
                    <th scope="col" className="px-1 py-1">
                      sản phẩm
                    </th>
                    <th scope="col" className="px-1 py-1">
                      Khách Hàng
                    </th>
                    <th scope="col" className="px-1 py-1 text-center">
                      Tổng Giá tiền
                    </th>
                    <th scope="col" className="px-1 py-2 text-center">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-1 py-1 text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listOrders?.length > 0 &&
                    listOrders.slice(0, 9).map((order, index) => {
                      return (
                        <tr
                          className="bg-white border-b hover:bg-gray-100 "
                          key={order?._id || index}
                        >
                          <td className="px-2 text-sm py-1 text-gray-500">
                            <img
                              src={order?.productId?.imagePreview}
                              alt=""
                              className="h-8 w-8 rounded-md bg-slate-200 shadow-md"
                            />
                          </td>
                          <td className="px-2 text-sm text-gray-500 py-1">
                            {(order?.userId?.displayName &&
                              order?.userId?.displayName?.slice(0, 10) +
                                "...") ||
                              order?.userId?.email}
                          </td>
                          <td className="px-2 text-sm py-1 text-yellow-600 font-bold flex items-center justify-center gap-2">
                            {numberWithCommas(order?.totalPrice)}{" "}
                            <span className="text-black text-xs font-bold">
                              VND
                            </span>
                          </td>
                          <td className="px-2 text-sm py-1 text-gray-500">
                            {
                              statusOrder.find(
                                (status) => status.name === order?.status
                              ).value
                            }
                          </td>
                          <td className=" text-sm py-1 text-gray-500 flex items-center gap-1 justify-center">
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-gray-200 text-xs px-1 hover:bg-slate-300"
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
              </table>
              <Pagination
                totalPage={totalPage}
                handlePageChange={handlePageChange}
                page={page}
                limit={limit}
                setLimit={setLimit}
                className="pb-0"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white rounded-md p-3 flex flex-col items-center gap-4">
          <div className="w-40 h-40 mx-auto bg-white">
            <img
              src={storeProfile?.avatar}
              alt=""
              className="h-full w-full rounded-full border-4 border-slate-400 object-cover"
            />
          </div>
          <span className="text-xl font-extrabold text-slate-700 uppercase">
            {storeProfile?.name}
          </span>
          <div className="col-span-5 flex flex-col gap-3">
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.BsCameraFill size={20} />{" "}
              </span>
              <Label label="Sản phẩm: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">0</p>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.FaUserFriends size={20} />{" "}
              </span>
              <Label label="Người theo dõi: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">
                {profileStore?.userFollowIds?.length}
              </p>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.FaStar size={20} />{" "}
              </span>
              <Label label="Đánh giá: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">
                {profileStore?.rating?.toFixed(1)}
              </p>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.FaUserCheck size={20} />{" "}
              </span>
              <Label label="Tham gia ngày: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">
                {covertToDate(profileStore?.createdAt)}
              </p>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.IoLocationSharp size={20} />{" "}
              </span>
              <Label label="Vị trí: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">
                {profileStore?.location}
              </p>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-slate-200 rounded-full p-2">
              <span className="text-yellow-600 bg-slate-50 rounded-full p-2">
                <icons.BsFillPhoneVibrateFill size={20} />{" "}
              </span>
              <Label label="Số điện thoại: " className="text-sm" />
              <p className="text-gray-500 text-sm font-bold">
                {profileStore?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SumaryStore;

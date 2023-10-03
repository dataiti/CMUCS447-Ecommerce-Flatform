import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Label from "../../../components/Label";
import { menuChartAnalysis, menuLevelAnalysis } from "../../../utils/constant";
import VerticalBarChart from "../../../components/VerticalBarChart";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { authSelect } from "../../../redux/features/authSlice";
import { storeSelect } from "../../../redux/features/storeSlice";
import {
  getRankCustomerApi,
  getRankProductByCountApi,
  getRankProductByRevenueApi,
  getRevenueByMonthApi,
  getRevenueLast30DaysApi,
  getRevenueLast7DaysApi,
  getTotalRevenueApi,
} from "../../../apis/revenue";
import { numberWithCommas } from "../../../utils/fn";
import Loading from "../../../components/Loading";

const AnalysisPage = () => {
  const [typeRevenue, setTypeRevenue] = useState("last30days");
  const [typeRank, setTypeRank] = useState("revenue");
  const [revenueData, setRevenueData] = useState([]);
  const [rankProductData, setRankProductData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rankCustomerSpending, setRankCustomerSpending] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  const { userInfo } = useSelector(authSelect);
  const { storeProfile } = useSelector(storeSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Phân tích dữ liệu"));
  }, [dispatch]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);

        if (typeRevenue === "last7days") {
          const resRevenue = await getRevenueLast7DaysApi({ storeId: id });
          if (resRevenue && resRevenue.data) {
            setRevenueData(resRevenue.data);
          }
        }

        if (typeRevenue === "last30days") {
          const resRevenue = await getRevenueLast30DaysApi({ storeId: id });
          if (resRevenue && resRevenue.data) {
            setRevenueData(resRevenue.data);
          }
        }

        if (typeRevenue === "year") {
          const resRevenue = await getRevenueByMonthApi({ storeId: id });
          setRevenueData(resRevenue.data);
        }

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

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);

        if (typeRank === "revenue") {
          const resRankProduct = await getRankProductByRevenueApi({
            storeId: id,
          });
          if (resRankProduct && resRankProduct.data) {
            setRankProductData(resRankProduct.data);
          }
        }

        if (typeRank === "count") {
          const resRankProduct = await getRankProductByCountApi({
            storeId: id,
          });
          if (resRankProduct && resRankProduct.data) {
            setRankProductData(resRankProduct.data);
          }
        }

        const resRankCustomerSpending = await getRankCustomerApi({
          storeId: id,
        });
        if (resRankCustomerSpending && resRankCustomerSpending.data) {
          setRankCustomerSpending(resRankCustomerSpending.data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, []);

  return (
    <div className="px-[10px] mx-10 py-8 flex flex-col gap-2 ">
      {isLoading && <Loading />}
      <div className="flex items-center gap-2 p-4 bg-white shadow-sm rounded-md border">
        <Label label="Khung thời gian" />
        <ul className="flex items-center gap-2">
          {menuChartAnalysis.map((item) => (
            <li
              className={`text-gray-600 text-sm cursor-pointer hover:bg-slate-300 transition-all rounded-sm px-4 py-1 bg-gray-200 ${
                item.value === typeRevenue && "bg-slate-400 text-white"
              }`}
              key={item.value}
              onClick={() => setTypeRevenue(item.value)}
            >
              {item.key}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-10 gap-2">
        <div className="col-span-7 p-4 bg-white shadow-sm rounded-md border">
          <Label label="Biểu đồ" />
          <VerticalBarChart className="h-[400px]" data={revenueData} />
        </div>
        <div className="col-span-3 p-4 bg-white shadow-sm rounded-md border">
          <Label label="Chỉ số quan trọng" />
          <div className="h-[90%] col-span-2 grid grid-cols-2 gap-1">
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
            <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
              <Label label="Đơn mua mới" className="uppercase" />
              <div className="font-bold text-yellow-700 text-3xl">
                {numberWithCommas(totalRevenue.todayRevenue / 1000) || 0}
                <span className="text-lg text-black">K</span>
              </div>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50/30 rounded-md border border-yellow-400">
              <Label label="Người theo dõi mới" className="uppercase" />
              <div className="font-bold text-yellow-700 text-3xl">
                {numberWithCommas(totalRevenue.todayRevenue / 1000) || 0}
                <span className="text-lg text-black">K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-4 p-4 bg-white shadow-sm rounded-md border">
          <div className="flex items-center gap-4">
            <Label label="Thứ hạng sản phẩm" />
            <ul className="flex items-center gap-2">
              {menuLevelAnalysis.map((item) => (
                <li
                  className={`text-gray-600 text-sm cursor-pointer hover:bg-slate-300 transition-all rounded-sm px-4 py-1 bg-gray-200 ${
                    item.value === typeRank && "bg-slate-400 text-white"
                  }`}
                  key={item.value}
                  onClick={() => setTypeRank(item.value)}
                >
                  {item.key}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 gap-2 bg-slate-300 p-2 rounded-md">
              <Label label="Thứ hạng" />
              <Label label="Thông tin sản phẩm" className="col-span-3" />
              {typeRank === "revenue" ? (
                <Label label="Theo doanh số" />
              ) : (
                <Label label="Theo số lượng" />
              )}
            </div>
            {rankProductData?.length > 0 &&
              rankProductData.map((item, index) => {
                return (
                  <div
                    className="p-1 rounded-md bg-slate-100 grid grid-cols-5 gap-2"
                    key={item?._id}
                  >
                    <div className="flex items-center justify-center">
                      <span className="font-bold text-sm text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <img
                        src={item?.product?.imagePreview}
                        alt=""
                        className="h-14 w-14 border rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="name text-sm font-bold">
                          {item?.product?.name}
                        </p>
                        <p className="text-emerald-600 font-bold">
                          {numberWithCommas(
                            Number(item?.product?.price?.$numberDecimal)
                          )}{" "}
                          <span className="text-xs text-black">VND</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-yellow-500 text-xs font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
                      {typeRank === "revenue"
                        ? numberWithCommas(Number(item?.totalPrice))
                        : item?.quantity}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4 bg-white shadow-sm rounded-md border">
          <Label label="Thứ hạng người dùng chi tiêu" />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-2 bg-slate-300 p-2 rounded-md">
              <Label label="Thứ hạng" />
              <Label label="Thông tin sản phẩm" className="col-span-3" />
              <Label label="Theo chi tiêu" />
            </div>
            {rankCustomerSpending.length > 0 &&
              rankCustomerSpending.map((item, index) => {
                return (
                  <div
                    className="p-1 rounded-md bg-slate-100 grid grid-cols-5 gap-2"
                    key={item?._id}
                  >
                    <div className="flex items-center justify-center">
                      <span className="font-bold text-sm text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <img
                        src={item?.user?.avatar}
                        alt=""
                        className="h-14 w-14 border rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="name-1 text-sm font-bold">
                          {item?.user?.displayName}
                        </p>
                        <p className="text-gray-400 font-bold">
                          {item?.user?.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-yellow-500 text-xs font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
                      {numberWithCommas(Number(item?.value))}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;

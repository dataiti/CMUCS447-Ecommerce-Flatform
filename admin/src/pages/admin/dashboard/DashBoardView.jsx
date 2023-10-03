import React, { useEffect, useState } from "react";
import { authSelect } from "../../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { icons } from "../../../utils/icons";
import TotalParameter from "../../../components/TotalParameter";
import Label from "../../../components/Label";
import DoughnutChart from "../../../components/DoughnutChart";
import {
  getIndexTotalOfSystemForAdminApi,
  getParameterOfCategoryForAdminApi,
  getParameterOfRegionForAdminApi,
  getRankOfRevenueStoresForAdminApi,
  getRevenueLast30DaysForAdminApi,
  getRevenueLast7DaysForAminApi,
  getRevenueMonthsOfYearForAdminApi,
} from "../../../apis/revenue.";
import VerticalBarChart from "../../../components/VerticalBarChart";
import Container from "../../../components/Container";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { menuChartAnalysis } from "../../../utils/constant";
import Loading from "../../../components/Loading";
import { numberWithCommas } from "../../../utils/fn";

const DashBoardView = () => {
  const [revenueByCategoryData, setRevenueByCategoryData] = useState([]);
  const [revenueByRegionData, setRevenueByRegionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [indexTotal, setIndexTotal] = useState([]);
  const [rankStoreData, setRankStoreData] = useState([]);
  const [typeRevenue, setTypeRevenue] = useState("last30days");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Bảng điều khiển"));
  }, [dispatch]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        const resrevenueByCategory = await getParameterOfCategoryForAdminApi({
          userId: userInfo?._id,
        });
        if (resrevenueByCategory && resrevenueByCategory.data) {
          setRevenueByCategoryData(resrevenueByCategory.data);
        }

        const resRevenueByRegion = await getParameterOfRegionForAdminApi({
          userId: userInfo?._id,
        });
        if (resRevenueByRegion && resRevenueByRegion.data) {
          setRevenueByRegionData(resRevenueByRegion.data);
        }

        const resRankStoreData = await getRankOfRevenueStoresForAdminApi({
          userId: userInfo?._id,
        });

        if (resRankStoreData && resRankStoreData.data) {
          setRankStoreData(resRankStoreData.data);
        }

        const resIndexTotalData = await getIndexTotalOfSystemForAdminApi({
          userId: userInfo?._id,
        });

        if (resIndexTotalData && resIndexTotalData.data) {
          setIndexTotal(resIndexTotalData.data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setIsLoading(true);
        if (typeRevenue === "year") {
          const resRevenueMonthsOfYear =
            await getRevenueMonthsOfYearForAdminApi({
              userId: userInfo?._id,
            });
          if (resRevenueMonthsOfYear && resRevenueMonthsOfYear.data) {
            setRevenueData(resRevenueMonthsOfYear.data);
          }
        }

        if (typeRevenue === "last30days") {
          const resRevenueLast30days = await getRevenueLast30DaysForAdminApi({
            userId: userInfo?._id,
          });
          if (resRevenueLast30days && resRevenueLast30days.data) {
            setRevenueData(resRevenueLast30days.data);
          }
        }

        if (typeRevenue === "last7days") {
          const resRevenueLast7days = await getRevenueLast7DaysForAminApi({
            userId: userInfo?._id,
          });
          if (resRevenueLast7days && resRevenueLast7days.data) {
            setRevenueData(resRevenueLast7days.data);
          }
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchAPI();
  }, [typeRevenue]);

  return (
    <div className="py-5 px-8 flex flex-col gap-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2">
            <TotalParameter
              icon={<icons.FaUserFriends />}
              title="Tổng số khách hàng"
              value={indexTotal?.totalCustomers}
              percent={20}
              isIncrement
              to="/dashboard/customers"
            />
            <TotalParameter
              icon={<icons.FaUserFriends />}
              title="Tổng số sản phẩm"
              value={indexTotal?.totalProducts}
              percent={10}
              isIncrement
              to="/dashboard/products"
            />
            <TotalParameter
              icon={<icons.FaUserFriends />}
              title="Tổng số đơn hàng"
              value={indexTotal?.totalOrders}
              percent={20}
              to="/dashboard/orders"
            />
            <TotalParameter
              icon={<icons.FaUserFriends />}
              title="Tổng số cửa hàng"
              value={indexTotal?.totalStores}
              percent={50}
              isIncrement
              to="/dashboard/stores"
            />
            <TotalParameter
              icon={<icons.FaUserFriends />}
              title="Tổng số doanh thu"
              value={numberWithCommas(Number(indexTotal?.totalRevenue))}
              percent={18}
            />
          </div>
          <div className="grid grid-cols-10 gap-2">
            <Container className="col-span-7">
              <div className="flex items-center justify-between">
                <Label label="Doanh thu bán sản phẩm" />
                <ul className="flex items-center gap-2">
                  {menuChartAnalysis.map((item) => (
                    <li
                      className={`text-gray-600 text-sm cursor-pointer hover:bg-slate-300 transition-all rounded-sm px-4 py-1 bg-gray-200 ${
                        item.value === typeRevenue && "bg-slate-700 text-white"
                      }`}
                      key={item.value}
                      onClick={() => setTypeRevenue(item.value)}
                    >
                      {item.key}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <VerticalBarChart className="h-[400px]" data={revenueData} />
              </div>
            </Container>
            <Container className="col-span-3 flex flex-col gap-2 ">
              <Label label="Bán theo tỉnh / thành phố" />
              <div className="flex flex-col">
                <div className="col-span-3">
                  <DoughnutChart data={revenueByRegionData} isRegion />
                </div>
                <div className="col-span-2 flex flex-col items-center gap-2">
                  {revenueByRegionData.length > 0 &&
                    revenueByRegionData.map((item) => (
                      <div
                        className="flex items-center gap-2 text-sm font-bold text-teal-800"
                        key={item?._id}
                      >
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="">{item?._id}</p>
                        <span>-</span>
                        <p>{(item?.percent).toFixed(1)} %</p>
                      </div>
                    ))}
                </div>
              </div>
            </Container>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Container className="col-span-1 flex flex-col gap-2 ">
              <Label label="Bán theo danh mục sản phẩm" />
              <div className="grid grid-cols-5">
                <div className="col-span-3">
                  <DoughnutChart data={revenueByCategoryData} />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                  {revenueByCategoryData.length > 0 &&
                    revenueByCategoryData.map((item) => (
                      <div
                        className="flex items-center gap-2 text-sm font-bold text-teal-800"
                        key={item?._id}
                      >
                        <div className="bg-slate-200 rounded-md w-8 h-8 p-1">
                          <img
                            src={item?.category?.image}
                            alt=""
                            className="object-cover"
                          />
                        </div>
                        <p className="">{item?.category?.name}</p>
                        <span>-</span>
                        <p>{(item?.percent).toFixed(1)} %</p>
                      </div>
                    ))}
                </div>
              </div>
            </Container>
            <Container className="col-span-1 flex flex-col gap-2 ">
              <Label label="Xếp hạng theo cửa hàng bán chạy" />
              <div className="grid grid-cols-5 gap-2 bg-gray-200/70 p-2 rounded-md">
                <Label label="Thứ hạng" className="text-center" />
                <Label label="Thông tin sản phẩm" className="col-span-3" />
                <Label label="Theo doanh số" className="text-center" />
              </div>
              <div className="flex flex-col gap-1">
                {rankStoreData?.length > 0 &&
                  rankStoreData.map((item, index) => {
                    return (
                      <div
                        className="p-1 rounded-md bg-slate-100 grid grid-cols-5 gap-2"
                        key={item?._id}
                      >
                        <div className="flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600 rounded-full p-2">
                            {index + 1}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <img
                            src={item?.store?.avatar}
                            alt=""
                            className="h-14 w-14 border rounded-md"
                          />
                          <div className="flex flex-col">
                            <p className="name text-sm font-bold">
                              {item?.store?.name}
                            </p>
                            <p className="text-emerald-600 font-bold">
                              {item?.store?.location}
                            </p>
                          </div>
                        </div>
                        <p className="text-yellow-500 text-xs font-bold px-4 py-1 bg-red-50 rounded-sm flex items-center justify-center">
                          {numberWithCommas(Number(item?.revenue))}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </Container>
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoardView;

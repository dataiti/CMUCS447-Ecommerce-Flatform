import React, { useEffect, useState } from "react";
import { icons } from "../../utils/icons";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  getListTransactionForAdminThunkAction,
  transactionSelect,
} from "../../redux/features/transactionSlice";
import { authSelect } from "../../redux/features/authSlice";
import { setTitleHeader } from "../../redux/features/titleSlice";
import { covertToDate, numberWithCommas } from "../../utils/fn";

const TransactionHistoty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const { listTransactions, totalPage } = useSelector(transactionSelect);
  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Lịch sử giao dịch"));
  }, [dispatch]);

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListTransactionForAdminThunkAction({
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
  }, [dispatch, orderBy, sortBy, q, limit, page, userInfo?._id]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="px-[10px] mx-5 py-6">
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
                Người Gửi
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Người Nhận
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Loại Thanh Toán
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Số tiền
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Ngày giao dịch
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <Loading />
          ) : (
            <tbody>
              {listTransactions?.length > 0 &&
                listTransactions.map((transaction, index) => {
                  return (
                    <tr
                      className="bg-white border-b hover:bg-gray-100 "
                      key={transaction?._id || index}
                    >
                      <td className="px-6 text-sm py-2 text-gray-500 font-bold text-center">
                        ... {transaction?._id.slice(-4)}
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 font-bold">
                        <div className="flex items-center gap-2">
                          <img
                            src={transaction?.payerId?.avatar}
                            alt=""
                            className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                          />
                          <div className="flex flex-col">
                            <p>
                              {transaction?.payerId?.email ||
                                transaction?.payerId?.displayName}
                            </p>
                            <p>{transaction?.payerId?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-gray-500 font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={transaction?.receiverId?.avatar}
                            alt=""
                            className="h-10 w-10 rounded-md bg-slate-200 shadow-md"
                          />
                          <div className="flex flex-col">
                            <p>{transaction?.receiverId?.name}</p>
                            <p>{transaction?.receiverId?.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-sm py-2 text-gray-500 font-bold text-center">
                        {transaction?.transactionMethod === "PayPal" && (
                          <div className="flex items-center justify-center gap-3 text-sm font-bold">
                            <span className="text-blue-500">
                              <icons.FaCcPaypal size={24} />
                            </span>
                            <p>{transaction?.transactionMethod}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 text-sm text-gray-500 font-bold py-2 text-center">
                        {numberWithCommas(Number(transaction?.amount))}
                      </td>
                      <td className="px-6 text-sm text-gray-500 font-bold py-2 text-center">
                        {covertToDate(transaction?.createdAt)}
                      </td>
                      <td className=" text-sm py-2 text-gray-700 font-bold flex items-center gap-1 justify-center">
                        <Button
                          className="bg-gray-200 text-xs px-2 hover:bg-slate-300"
                          to={`/my-store/manage/`}
                        >
                          Xem chi tiết
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

export default TransactionHistoty;

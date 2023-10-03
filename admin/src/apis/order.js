import axiosClient from "../configs/axiosConfig";

const getOrderStatusForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  status,
  userId,
}) => {
  const res = await axiosClient.get(
    `/order/get-orders/admin/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`
  );
  if (res) {
    return res;
  }
};

const getTodoListByStoreeApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/order/get-todo-list/${storeId}`);
  if (res) {
    return res;
  }
};

const getRevenueLast7DaysApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/order/get-revenue/last-7-days/${storeId}`
  );
  if (res) {
    return res;
  }
};

const getRevenueByMonthApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/order/get-revenue/month/${storeId}`);
  if (res) {
    return res;
  }
};

const getTotalRevenueApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/order/get-total-revenue/${storeId}`);
  if (res) {
    return res;
  }
};

const getDetailOrderApi = async ({ orderId }) => {
  const res = await axiosClient.get(`/order/get-orders/detail/${orderId}`);
  if (res) {
    return res;
  }
};

export {
  getOrderStatusForAdminApi,
  getTodoListByStoreeApi,
  getRevenueLast7DaysApi,
  getDetailOrderApi,
  getRevenueByMonthApi,
  getTotalRevenueApi,
};

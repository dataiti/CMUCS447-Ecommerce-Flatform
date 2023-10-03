import axiosClient from "../configs/axiosConfig";

const getTodoListByStoreeApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/revenue/get-todo-list/${storeId}`);
  if (res) {
    return res;
  }
};

const getRevenueLast7DaysApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/revenue/get-revenue/last-7-days/${storeId}`
  );
  if (res) {
    return res;
  }
};

const getRevenueLast30DaysApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/revenue/get-revenue/last-30-days/${storeId}`
  );
  if (res) {
    return res;
  }
};

const getRevenueByMonthApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/revenue/get-revenue/month/${storeId}`);
  if (res) {
    return res;
  }
};

const getTotalRevenueApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/revenue/get-total-revenue/${storeId}`);
  if (res) {
    return res;
  }
};

const getRankProductByRevenueApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/revenue/get-rank-product/by-revenue/${storeId}`
  );
  if (res) {
    return res;
  }
};

const getRankProductByCountApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/revenue/get-rank-product/by-count/${storeId}`
  );
  if (res) {
    return res;
  }
};

const getRankCustomerApi = async ({ storeId }) => {
  const res = await axiosClient.get(
    `/revenue/get-rank-customer/by-spending/${storeId}`
  );
  if (res) {
    return res;
  }
};

export {
  getTodoListByStoreeApi,
  getRevenueLast7DaysApi,
  getRevenueByMonthApi,
  getTotalRevenueApi,
  getRevenueLast30DaysApi,
  getRankProductByRevenueApi,
  getRankProductByCountApi,
  getRankCustomerApi,
};

import axiosClient from "../configs/axiosConfig";

const createOrderApi = async ({ userId, data, token }) => {
  const res = await axiosClient.post(`/order/create-order/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res) {
    return res;
  }
};

const getOrderStatusByUserApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  status,
  userId,
}) => {
  const res = await axiosClient.get(
    `/order/get-orders-status/by-user/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`
  );
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

const cancelOrderApi = async ({ userId, orderId }) => {
  const res = await axiosClient.put(`/order/cancel-order/${userId}/${orderId}`);
  if (res) {
    return res;
  }
};

export {
  createOrderApi,
  getOrderStatusByUserApi,
  getDetailOrderApi,
  cancelOrderApi,
};

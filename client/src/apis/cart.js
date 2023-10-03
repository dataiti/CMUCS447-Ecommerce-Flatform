import axiosClient from "../configs/axiosConfig";

const addCartApi = async ({ userId, data }) => {
  const res = await axiosClient.post(`/cart/add-cart/${userId}`, data);
  if (res) {
    return res;
  }
};

const getListCartsByUserApi = async ({ userId, token }) => {
  const res = await axiosClient.get(`/cart/list-carts/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res) {
    return res;
  }
};

const removeCartApi = async ({ userId, cartId }) => {
  const res = await axiosClient.delete(`/cart/remove-cart/${userId}/${cartId}`);
  if (res) {
    return res;
  }
};

const removeCartItemApi = async ({ userId, cartItemId }) => {
  const res = await axiosClient.delete(
    `/cart/remove-cart-item/${userId}/${cartItemId}`
  );
  if (res) {
    return res;
  }
};

const incrementQuantityCartApi = async ({ userId, cartId }) => {
  const res = await axiosClient.put(
    `/cart/increment-quantity/${userId}/${cartId}`
  );
  if (res) {
    return res;
  }
};

const decrementQuantityCartApi = async ({ userId, cartId }) => {
  const res = await axiosClient.put(
    `/cart/decrement-quantity/${userId}/${cartId}`
  );
  if (res) {
    return res;
  }
};

const setQuantityCartApi = async ({ userId, cartId, data }) => {
  const res = await axiosClient.put(
    `/cart/set-quantity/${userId}/${cartId}`,
    data
  );
  if (res) {
    return res;
  }
};

export {
  addCartApi,
  getListCartsByUserApi,
  removeCartApi,
  removeCartItemApi,
  incrementQuantityCartApi,
  decrementQuantityCartApi,
  setQuantityCartApi,
};

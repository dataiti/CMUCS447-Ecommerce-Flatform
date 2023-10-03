import axiosClient from "../configs/axiosConfig";

const createProductApi = async ({ storeId, userId, formData }) => {
  const res = await axiosClient.post(
    `/product/create-product/${storeId}/${userId}`,
    formData
  );
  if (res) {
    return res;
  }
};

const getListProductsByStoreApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  categoryId,
  rating,
  minPrice,
  maxPrice,
  storeId,
  userId,
}) => {
  const res = await axiosClient.get(
    `/product/list-products/by-store/${storeId}/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&categoryId=${categoryId}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
  if (res) {
    return res;
  }
};

const removeProductApi = async ({ storeId, userId, productId }) => {
  const res = await axiosClient.delete(
    `/product/delete-product/${storeId}/${userId}/${productId}`
  );
  if (res) {
    return res;
  }
};

const getListHotSellingProductsByStoreApi = async ({ storeId, userId }) => {
  const res = await axiosClient.get(
    `/product/list-hot-products/by-store/${storeId}/${userId}`
  );
  if (res) {
    return res;
  }
};

export {
  createProductApi,
  getListProductsByStoreApi,
  removeProductApi,
  getListHotSellingProductsByStoreApi,
};

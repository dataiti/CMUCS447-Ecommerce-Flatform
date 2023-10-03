import axiosClient from "../configs/axiosConfig";

const createProductApi = async ({ storeId, formData }) => {
  const res = await axiosClient.post(
    `/product/create-product/${storeId}`,
    formData
  );
  if (res) {
    return res;
  }
};

const getListProductsForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  categoryId,
  rating,
  minPrice,
  maxPrice,
  status,
  userId,
}) => {
  const res = await axiosClient.get(
    `/product/list-hot-products/admin/${userId}?status=${status}&q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&categoryId=${categoryId}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
  if (res) {
    return res;
  }
};

export { createProductApi, getListProductsForAdminApi };

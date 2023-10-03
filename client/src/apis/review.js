import axiosClient from "../configs/axiosConfig";

const getListReviewByProductApi = async ({
  orderBy,
  sortBy,
  limit,
  page,
  rating,
  storeId,
  productId,
}) => {
  const res = await axiosClient.get(
    `/review/list-reviews/by-product/${productId}/${storeId}?sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&rating=${rating}`
  );
  if (res) {
    return res;
  }
};

const createReviewApi = async ({ userId, formData }) => {
  const res = await axiosClient.post(
    `/review/create-review/${userId}`,
    formData
  );
  if (res) {
    return res;
  }
};

export { getListReviewByProductApi, createReviewApi };

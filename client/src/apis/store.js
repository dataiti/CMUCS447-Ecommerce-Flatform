import axiosClient from "../configs/axiosConfig";

const getListStoreByUserApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  userId,
}) => {
  const res = await axiosClient.get(
    `/store/list-stores/by/user/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
  if (res) {
    return res;
  }
};

const getListFeatureImagesApi = async ({ userId, storeId }) => {
  const res = await axiosClient.get(
    `/store/list-feature-image/${storeId}/${userId}`
  );
  if (res) {
    return res;
  }
};

const getStoreApi = async ({ storeId }) => {
  const res = await axiosClient.get(`/store/get-store/${storeId}`);
  if (res) {
    return res;
  }
};

export { getListStoreByUserApi, getListFeatureImagesApi, getStoreApi };

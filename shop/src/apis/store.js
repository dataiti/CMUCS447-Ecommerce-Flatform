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

const createStoreApi = async ({ userId, formData }) => {
  for (const value of formData.values()) {
    console.log(value);
  }
  const res = await axiosClient.post(`/store/create-store/${userId}`, formData);
  if (res) {
    return res;
  }
};

const getProfileStoreApi = async ({ userId, storeId }) => {
  const res = await axiosClient.get(
    `/store/profile-store/${storeId}/${userId}`
  );
  if (res) {
    return res;
  }
};

const updateProfileStoreApi = async ({ userId, storeId, formData }) => {
  const res = await axiosClient.put(
    `/store/update-store/${storeId}/${userId}`,
    formData
  );
  if (res) {
    return res;
  }
};

const setLayoutFeatureImageApi = async ({ userId, storeId, data }) => {
  const res = await axiosClient.put(
    `/store/set-layout-store/${storeId}/${userId}`,
    data
  );
  if (res) {
    return res;
  }
};

const setShowHotProductSellingApi = async ({ userId, storeId }) => {
  const res = await axiosClient.put(
    `/store/set-show-products-selling/${storeId}/${userId}`
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

const addFeatureImageApi = async ({ userId, storeId, formData }) => {
  const res = await axiosClient.post(
    `/store/add-feature-image/${storeId}/${userId}`,
    formData
  );
  if (res) {
    return res;
  }
};

export {
  getListStoreByUserApi,
  getListFeatureImagesApi,
  createStoreApi,
  getProfileStoreApi,
  updateProfileStoreApi,
  setLayoutFeatureImageApi,
  setShowHotProductSellingApi,
  addFeatureImageApi,
};

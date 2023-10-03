import axiosClient from "../configs/axiosConfig";

const getListCategoriesForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  userId,
}) => {
  const res = await axiosClient.get(
    `/category/list-categories/admin/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
  if (res) {
    return res;
  }
};

const getListCategoriesApi = async () => {
  const res = await axiosClient.get("/category/list-categories");
  if (res) {
    return res;
  }
};

const getCategoryApi = async (categoryId) => {
  const res = await axiosClient.get(`/category/get-category/${categoryId}`);
  if (res) {
    return res;
  }
};

const createCategoryApi = async (formData) => {
  const res = await axiosClient.post(`/category/create-category`, formData);
  if (res) {
    return res;
  }
};

const updateCategoryApi = async ({ id, formData }) => {
  const res = await axiosClient.put(
    `/category/update-category/${id}`,
    formData
  );
  if (res) {
    return res;
  }
};

const removeCategoryApi = async (categoryId) => {
  const res = await axiosClient.delete(
    `/category/remove-category/${categoryId}`
  );
  if (res) {
    return res;
  }
};

export {
  getListCategoriesForAdminApi,
  getListCategoriesApi,
  getCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  removeCategoryApi,
};

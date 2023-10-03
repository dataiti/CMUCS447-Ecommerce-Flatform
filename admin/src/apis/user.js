import axiosClient from "../configs/axiosConfig";

const getListUserForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  status,
  userId,
}) => {
  const res = await axiosClient.get(
    `/user/list-users/admin/${userId}?status=${status}&q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
  if (res) {
    return res;
  }
};

const getUserApi = async (userId) => {
  const res = await axiosClient.get(`/user//get-user/${userId}`);
  if (res) {
    return res;
  }
};

const replacePasswordApi = async (userId, data) => {
  const res = await axiosClient.put(`/user/replace-password/${userId}`, data);
  if (res) {
    return res;
  }
};

const updateProfileApi = async (userId, data) => {
  const res = await axiosClient.put(`/user/update-profile/${userId}`, data);
  if (res) {
    return res;
  }
};

const getProfileApi = async (userId) => {
  const res = await axiosClient.get(`/user/profile/${userId}`);
  if (res) {
    return res;
  }
};

const updateAvatarApi = async (userId, formData) => {
  const res = await axiosClient.post(
    `/user/upload-avatar/${userId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  if (res) {
    return res;
  }
};

export {
  getListUserForAdminApi,
  getUserApi,
  replacePasswordApi,
  updateProfileApi,
  getProfileApi,
  updateAvatarApi,
};

import axiosClient from "../configs/axiosConfig";

const getListStoresForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  status,
  userId,
}) => {
  const res = await axiosClient.get(
    `/store/list-stores/admin/${userId}?status=${status}&q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
  if (res) {
    return res;
  }
};

export { getListStoresForAdminApi };

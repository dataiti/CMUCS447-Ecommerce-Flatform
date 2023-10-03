import axiosClient from "../configs/axiosConfig";

const getListTransactionForAdminApi = async ({
  orderBy,
  sortBy,
  q,
  limit,
  page,
  userId,
}) => {
  const res = await axiosClient.get(
    `/transaction/list-transactions/admin/${userId}?q=${q}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}`
  );
  if (res) {
    return res;
  }
};

export { getListTransactionForAdminApi };

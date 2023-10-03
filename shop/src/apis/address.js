import axiosClient from "../configs/axiosConfig";

const getListAdressesByUserApi = async (userId) => {
  const res = await axiosClient.get(`/address/list-addreeses/${userId}`);
  if (res) {
    return res;
  }
};

export { getListAdressesByUserApi };

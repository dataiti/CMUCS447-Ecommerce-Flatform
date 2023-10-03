import axiosClient from "../configs/axiosConfig";

const getListDeliveriesByUserApi = async () => {
  const res = await axiosClient.get(`/delivery/list-deliveries`);
  if (res) {
    return res;
  }
};

export { getListDeliveriesByUserApi };

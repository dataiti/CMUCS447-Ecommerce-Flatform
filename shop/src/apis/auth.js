import axiosClient from "../configs/axiosConfig";

const registerApi = async (data) => {
  const res = await axiosClient.post("/auth/register", data);
  if (res) {
    return res;
  }
};

const loginApi = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  if (res) {
    return res;
  }
};

const logoutApi = async () => {
  const res = await axiosClient.post("/auth/logout");
  if (res) {
    return res;
  }
};

const refreshTokenApi = async () => {
  const res = await axiosClient.post("/auth/refresh-token");
  if (res) {
    return res;
  }
};

export { registerApi, loginApi, logoutApi, refreshTokenApi };

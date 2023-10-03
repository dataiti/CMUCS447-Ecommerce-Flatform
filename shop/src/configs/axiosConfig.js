import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("persist:root"));
    const token = JSON.parse(dataLocalStorage.token);
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;

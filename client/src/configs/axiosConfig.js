import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshTokenApi } from "../apis/auth";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("persist:root"));
    const token = JSON.parse(dataLocalStorage.token);
    config.headers["Authorization"] = `Bearer ${token}`;
    // let token;
    // if (dataLocalStorage) {
    //   token = JSON.parse(dataLocalStorage.token);
    //   const decodedToken = jwtDecode(token);
    //   if (decodedToken.exp < Date.now() / 1000) {
    //     const newAccessToken = await refreshTokenApi();
    //     console.log(newAccessToken);
    //     config.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //   }
    // }
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

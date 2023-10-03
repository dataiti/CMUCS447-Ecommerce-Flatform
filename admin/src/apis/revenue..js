import axiosClient from "../configs/axiosConfig";

const getParameterOfCategoryForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-parameter/by-category/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

const getParameterOfRegionForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-parameter/by-region/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

const getRevenueMonthsOfYearForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-revenue/by-months/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

const getRevenueLast30DaysForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-revenue/last-30days/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

const getRankOfRevenueStoresForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-rank-revenue/by-store/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

const getIndexTotalOfSystemForAdminApi = async ({ userId }) => {
  const res = await axiosClient.get(`/revenue/get-index-total/admin/${userId}`);
  if (res) {
    return res;
  }
};

const getRevenueLast7DaysForAminApi = async ({ userId }) => {
  const res = await axiosClient.get(
    `/revenue/get-revenue/last-7-days/admin/${userId}`
  );
  if (res) {
    return res;
  }
};

export {
  getParameterOfCategoryForAdminApi,
  getParameterOfRegionForAdminApi,
  getRevenueMonthsOfYearForAdminApi,
  getRankOfRevenueStoresForAdminApi,
  getRevenueLast30DaysForAdminApi,
  getIndexTotalOfSystemForAdminApi,
  getRevenueLast7DaysForAminApi,
};

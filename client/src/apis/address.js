import axiosClient from "../configs/axiosConfig";
import axios from "axios";

const getListAdressesByUserApi = async ({ userId }) => {
  const res = await axiosClient.get(`/address/list-addreeses/${userId}`);
  if (res) {
    return res;
  }
};

const addAddressApi = async ({ userId, data }) => {
  const res = await axiosClient.post(`/address/add-address/${userId}`, data);
  if (res) {
    return res;
  }
};

const getListProvinceVietNamApi = async () => {
  const res = await axios.get(`${process.env.REACT_APP_VAPI_URL}/api/province`);
  if (res && res.data) {
    return res.data;
  }
};

const getListDistrictsVietNamApi = async ({ provinceId }) => {
  const res = await axios.get(
    `${process.env.REACT_APP_VAPI_URL}/api/province/district/${provinceId}`
  );
  if (res && res.data) {
    return res.data;
  }
};

const getListWardsVietNamApi = async ({ districtId }) => {
  const res = await axios.get(
    `${process.env.REACT_APP_VAPI_URL}/api/province/ward/${districtId}`
  );
  if (res && res.data) {
    return res.data;
  }
};

const getAddressDefaultApi = async ({ userId }) => {
  const res = await axiosClient.get(`/address/address-default/${userId}`);
  if (res) {
    return res;
  }
};

const setupDefaultAddressApi = async ({ userId, addressId }) => {
  const res = await axiosClient.put(
    `/address/set-default/${userId}/${addressId}`
  );
  if (res) {
    return res;
  }
};

// router.get('/list-addreeses/:userId', getAddressDefault);
// router.get('/address-default/:userId', getListAdressesByUser);
// router.post('/add-address/:userId', addAddress);
// router.put('/update-address/:userId/:addressId', updateAddress);
// router.put('/set-default/:userId/:addressId', setupDefaultAddress);
// router.delete('/remove-address/:userId/:addressId', removeAddress);

export {
  getListAdressesByUserApi,
  addAddressApi,
  getListProvinceVietNamApi,
  getListDistrictsVietNamApi,
  getListWardsVietNamApi,
  getAddressDefaultApi,
  setupDefaultAddressApi,
};

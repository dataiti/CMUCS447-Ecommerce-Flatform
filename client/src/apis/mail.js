import axiosClient from "../configs/axiosConfig";

const senMailOTPApi = async ({ data }) => {
  const res = await axiosClient.post("/mail/send-otp-order", data);
  if (res) {
    return res;
  }
};

export { senMailOTPApi };

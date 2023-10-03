import React, { memo, useEffect, useState } from "react";
import {
  getListDistrictsVietNamApi,
  getListWardsVietNamApi,
  getListProvinceVietNamApi,
  addAddressApi,
} from "../apis/address";
import { useForm, Controller } from "react-hook-form";
import Label from "../components/Label";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../redux/features/authSlice";
import { addAddressThunkAction } from "../redux/features/addressSlice";
import Swal from "sweetalert2";

const AddAddress = () => {
  const [listProvices, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const [provinceValue, setProvinceValue] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardValue, setWardValue] = useState("");
  const [wardId, setWardId] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [userNameValue, setUserNameValue] = useState("");
  const [exactAddressValue, setExactAddressValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const resonseProvinceVN = await getListProvinceVietNamApi();
        if (resonseProvinceVN && resonseProvinceVN.results) {
          setListProvinces(resonseProvinceVN.results);
        }

        if (provinceId) {
          const resonseDisTrictVN = await getListDistrictsVietNamApi({
            provinceId,
          });

          if (resonseDisTrictVN && resonseDisTrictVN.results) {
            setListDistricts(resonseDisTrictVN.results);
          }

          if (districtId) {
            const resonseWardsVN = await getListWardsVietNamApi({
              districtId,
            });

            if (resonseWardsVN && resonseWardsVN.results) {
              setListWards(resonseWardsVN.results);
            }
          }
        }
      } catch (error) {}
    };
    fetchApi();
  }, [provinceId, districtId]);

  const handleSelectProvince = (e) => {
    const value = JSON.parse(e.target.value);
    if (value) {
      setProvinceId(value.provinceId);
      setProvinceValue(value.provinceValue);
    }
  };

  const handleSelectDistrict = (e) => {
    const value = JSON.parse(e.target.value);
    if (value) {
      setDistrictId(value.districtId);
      setDistrictValue(value.districtValue);
    }
  };

  const handleSelectWard = (e) => {
    const value = JSON.parse(e.target.value);
    if (value) {
      setWardId(value.wardId);
      setWardValue(value.wardValue);
    }
  };

  const handleAddAddress = async () => {
    try {
      if (
        !userNameValue ||
        !phoneValue ||
        !provinceValue ||
        !districtValue ||
        !wardValue ||
        !exactAddressValue
      ) {
        return;
      }

      let data = {
        displayName: userNameValue,
        phone: phoneValue,
        province: provinceValue,
        district: districtValue,
        ward: wardValue,
        exactAddress: exactAddressValue,
      };

      setIsLoading(true);

      const res = await dispatch(
        addAddressThunkAction({ userId: userInfo?._id, data })
      );

      if (res && res.payload && res.payload.success) {
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm địa chỉ thành công",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-opacity border-2 border-white py-10 px-5 rounded-3xl">
      <h4 className="font-bold text-lg uppercase text-center">Thêm Địa Chỉ</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="">
          <Label label="Tỉnh/Thành Phố" className="mb-5" />
          <select
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer"
            onChange={handleSelectProvince}
          >
            <option defaultValue key="0">
              Chọn Tỉnh/Thành Phố
            </option>
            {listProvices?.length > 0 &&
              listProvices.map((item) => {
                return (
                  <option
                    value={JSON.stringify({
                      provinceId: item?.province_id,
                      provinceValue: item?.province_name,
                    })}
                    key={item?.province_id}
                  >
                    {item?.province_name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="">
          <Label label="Quận/Huyện" />
          <select
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer"
            onChange={handleSelectDistrict}
          >
            <option defaultValue key="0">
              Chọn Quận/Huyện
            </option>
            {listDistricts?.length > 0 &&
              listDistricts.map((item) => {
                return (
                  <option
                    value={JSON.stringify({
                      districtId: item?.district_id,
                      districtValue: item?.district_name,
                    })}
                    key={item?.district_name}
                  >
                    {item?.district_name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="col-span-2">
        <div className="">
          <Label label="Phường/Xã" />
          <select
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer "
            onChange={handleSelectWard}
          >
            <option defaultValue key="0">
              Chọn Phường/Xã
            </option>
            {listWards?.length > 0 &&
              listWards.map((item) => {
                return (
                  <option
                    value={JSON.stringify({
                      wardId: item?.ward_id,
                      wardValue: item?.ward_name,
                    })}
                    key={item?.ward_id}
                  >
                    {item?.ward_name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="col-span-2">
        <div className="">
          <Label label="Địa chỉ chính xác" />
          <input
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer "
            placeholder="Địa chỉ cụ thể"
            value={exactAddressValue}
            onChange={(e) => setExactAddressValue(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="">
          <Label label="Tên người dùng" />
          <input
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer "
            placeholder="Nhập tên người dùng"
            value={userNameValue}
            onChange={(e) => setUserNameValue(e.target.value)}
          />
        </div>
        <div className="">
          <Label label="Số điện thoại" />
          <input
            className="w-full outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer "
            placeholder="Nhập số điện thoại"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button primary onClick={handleAddAddress}>
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default memo(AddAddress);

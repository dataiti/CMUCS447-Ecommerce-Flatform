import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import { phoneRegExp } from "../../../utils/regex";
import Field from "../../../components/Field";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { icons } from "../../../utils/icons";
import Label from "../../../components/Label";
import { getProfileStoreApi, updateProfileStoreApi } from "../../../apis/store";
import { authSelect } from "../../../redux/features/authSlice";
import { setTitleHeader } from "../../../redux/features/titleSlice";

const addStoreSchema = yup.object({
  name: yup.string(),
  bio: yup.string(),
  location: yup.string(),
  phone: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại sai định dạng hoặc không hợp lệ !"),
});

const ProfileMyStore = () => {
  const [loading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [fileAvatar, setFileAvatar] = useState({});

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Hồ sơ Shop"));
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      phone: "",
    },
    resolver: yupResolver(addStoreSchema),
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const res = await getProfileStoreApi({
          userId: userInfo?._id,
          storeId: userInfo?.storeId,
        });
        if (res && res.data) {
          setAvatarPreview(res.data?.avatar);
          reset({
            name: res.data?.name,
            bio: res.data?.bio,
            location: res.data?.location,
            phone: res.data?.phone,
          });
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, []);

  const handleSelectedImagePreview = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      avatarPreview(file);
    }
  };

  const handleSubmitAddStore = async (values) => {
    try {
      if (!isValid) {
        return;
      }
      setIsLoading(true);
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("bio", values.bio);
      formData.append("location", values.location);
      formData.append("phone", values.phone);
      const res = await updateProfileStoreApi({
        userId: userInfo?._id,
        storeId: userInfo?.storeId,
        formData,
      });

      if (res && res.success) {
        Swal.fire({
          title: "Success",
          text: "Successful Shop registration",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      reset();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md my-20 mx-40">
      {(isSubmitting || loading) && <Loading />}
      <div className="grid grid-cols-3 w-full ">
        <form
          onSubmit={handleSubmit(handleSubmitAddStore)}
          className="col-span-2 w-[80%] mx-auto my-5"
        >
          <div className="">
            <div className="flex flex-col gap-4  px-10 py-4 ">
              <Field
                control={control}
                name="name"
                label="Tên Shop"
                placeholder="Nhập tên của Shop"
                errors={errors.name}
              />
              <Field
                control={control}
                name="bio"
                label="Shop bio"
                placeholder="Enter bio of the shop"
                errors={errors.bio}
              />
              <Field
                control={control}
                name="location"
                label="Vị trí Shop"
                placeholder="Nhập vị trí của Shop"
                errors={errors.location}
              />
              <Field
                control={control}
                name="phone"
                label="Số điện thoại Shop"
                placeholder="Nhập số điện thoại của Shop"
                errors={errors.phone}
              />
            </div>
          </div>
          <Button
            primary
            className="mx-auto w-[100px] rounded-full text-base py-3 mt-2"
          >
            Cập nhật
          </Button>
        </form>
        <div className="col-span-1 my-auto  flex flex-col items-center justify-center">
          <Label label="Logo của Shop" className="text-center" />
          <div className="relative rounded-full border border-dashed border-gray-300 h-[200px] w-[200px] flex items-center justify-center group">
            {avatarPreview ? (
              <>
                <img
                  src={avatarPreview}
                  alt="image"
                  className="rounded-full object-cover h-full w-full"
                />
                <label
                  className="absolute group hover:opacity-100 text-gray-500 cursor-pointer p-6 bg-slate-200 rounded-full opacity-0 transition-all"
                  htmlFor="image"
                >
                  <icons.BsCameraFill size={40} />
                </label>
                <input
                  id="image"
                  type="file"
                  hidden
                  onChange={handleSelectedImagePreview}
                />
              </>
            ) : (
              <>
                <label
                  className="text-gray-500 cursor-pointer p-6 bg-slate-200 rounded-full"
                  htmlFor="image"
                >
                  <icons.BsCameraFill size={40} />
                </label>
                <input
                  id="image"
                  type="file"
                  hidden
                  onChange={handleSelectedImagePreview}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMyStore;

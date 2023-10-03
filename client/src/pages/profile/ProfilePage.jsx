import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import FormData from "form-data";

import Button from "../../components/Button";
import Field from "../../components/Field";
import Loading from "../../components/Loading";
import {
  updateProfileApi,
  getProfileApi,
  updateAvatarApi,
} from "../../apis/user";
import { authSelect } from "../../redux/features/authSlice";
import Avatar from "../../components/Avatar";
import { phoneRegExp } from "../../utils/regex";

const editProfileSchema = yup.object({
  displayName: yup.string("Phải là dạng chuỗi kí tự"),
  email: yup
    .string("Phải là dạng chuỗi kí tự")
    .required("Bắt buộc !")
    .email("Sai định dạng email !"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại sai định dạng hoặc không hợp lệ !"),
});

const ProfilePage = () => {
  const [loading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileData, setProfileData] = useState({});

  const { userInfo } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(editProfileSchema),
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (userInfo) {
          setIsLoading(true);
          const response = await getProfileApi(userInfo?._id);
          if (response) {
            setProfileData(response.data);
            reset(response.data);
            setIsLoading(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [userInfo]);

  const handleFileUploadAvatar = async (e) => {
    setIsLoading(false);
    try {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      let formData = new FormData();
      formData.append("avatar", file);
      await updateAvatarApi(userInfo?._id, formData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSubmitChangePassword = async (values) => {
    try {
      if (!isValid) {
        return;
      }
      setIsLoading(true);
      await updateProfileApi(userInfo?._id, values);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-5 bg-white p-5 rounded-md shadow-md">
      {(isSubmitting || loading) && <Loading />}
      <div className="col-span-2 w-full ">
        <h3 className="text-center pb-5 text-xl font-bold border-b-2 border-primary-300">
          Hồ sơ của tôi
        </h3>
        <form
          onSubmit={handleSubmit(handleSubmitChangePassword)}
          className="w-[80%] mx-auto my-5"
        >
          <div className="flex flex-col gap-5">
            <Field
              control={control}
              name="displayName"
              label="Tên hiển thị"
              placeholder="Nhập tên hiển thị muốn thay đổi"
              errors={errors.displayName}
            />
            <Field
              control={control}
              name="email"
              label="Email"
              placeholder="Nhập email muốn thay đổi"
              errors={errors.email}
            />
            <Field
              control={control}
              name="phone"
              label="Số điện thoại"
              placeholder="Mhập mật số điện thoại muốn thay đổi"
              errors={errors.phone}
            />
            <Button
              primary
              className="mx-auto w-[100px] rounded-full text-base py-3 mt-2"
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
      <div className="col-span-1 m-auto">
        <Avatar
          src={avatarPreview ? avatarPreview : profileData?.avatar}
          className="h-[160px] w-[160px]"
        />
        <div className="text-center mt-5">
          <form action="/stats" encType="multipart/form-data" method="put">
            <label
              className="px-4 py-1 bg-primary-400 text-sm rounded-md text-white 
                cursor-pointer hover:bg-primary-500 transition-all"
              htmlFor="avatar"
            >
              {avatarPreview ? "Cập nhật" : "Chọn ảnh"}
            </label>
            <input
              id="avatar"
              type="file"
              hidden
              onChange={handleFileUploadAvatar}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";

import { phoneRegExp } from "../../../utils/regex";
import Field from "../../../components/Field";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { icons } from "../../../utils/icons";
import Label from "../../../components/Label";
import { createStoreApi } from "../../../apis/store";
import { authSelect } from "../../../redux/features/authSlice";
import { setTitleHeader } from "../../../redux/features/titleSlice";

const addStoreSchema = yup.object({
  name: yup.string().required("Bắt buộc !"),
  bio: yup.string().required("Bắt buộc !"),
  location: yup.string().required("Bắt buộc !"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại sai định dạng hoặc không hợp lệ !"),
});

const CreateShop = () => {
  const [loading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState({});

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Create Shop"));
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

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
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
      for (let i = 0; i < values.avatar.length; i++) {
        formData.append("avatar", values.avatar[i]);
      }
      const res = await createStoreApi({
        userId: userInfo?._id,
        formData,
      });

      if (res && res.success) {
        Swal.fire({
          title: "Success",
          text: "Successful Shop registration",
          icon: "success",
          confirmButtonText: "OK",
        });
        setImagePreview({});
        reset();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (userInfo) {
    return <Navigate to={`/shop/dashboard/${userInfo?.storeId}`} />;
  }


  return (
    <div className="bg-white rounded-md shadow-md my-20 mx-40 w-3/5">
      {(isSubmitting || loading) && <Loading />}
      <div className="px-10 py-5">
        <form onSubmit={handleSubmit(handleSubmitAddStore)}>
          <div className="grid grid-cols-3 w-full ">
            <div className="col-span-2">
              <div className="flex flex-col gap-4  px-10 py-4 ">
                <Field
                  control={control}
                  name="name"
                  label="Shop name"
                  placeholder="Enter name of the shop"
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
                  label="Shop location"
                  placeholder="Enter location of the shop"
                  errors={errors.location}
                />
                <Field
                  control={control}
                  name="phone"
                  label="Shop phone number"
                  placeholder="Enter phone number of the shop"
                  errors={errors.phone}
                />
              </div>
            </div>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange } }) => (
                <div className="col-span-1 my-auto  flex flex-col items-center justify-center">
                  <Label label="Avatar Shop" className="text-center" />
                  <div className="relative rounded-full border border-dashed border-gray-300 h-[200px] w-[200px] flex items-center justify-center group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
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
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImagePreview(e);
                          }}
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
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImagePreview(e);
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
          <Button
            primary
            className="mx-auto w-[100px] rounded-full text-base py-3 mt-2"
          >
            Create Shop
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;

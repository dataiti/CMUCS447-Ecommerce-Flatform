import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Field from "../../components/Field";
import Loading from "../../components/Loading";
import { replacePasswordApi } from "../../apis/user";
import { authSelect } from "../../redux/features/authSlice";

const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải ít nhất 8 kí tự !")
    .max(20, "Mật khẩu phải tối đa 20 kí tự !"),
  newPassword: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải ít nhất 8 kí tự !")
    .max(20, "Mật khẩu phải tối đa 20 kí tự !"),
  confirmPassword: yup
    .string()
    .required("Bắt buộc !")
    .oneOf(
      [yup.ref("newPassword"), null],
      "Xác nhận mật khẩu không trùng khớp"
    ),
});

const ChangePasswordPage = () => {
  const [loading, setIsLoading] = useState(false);

  const { userInfo } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const handleSubmitChangePassword = async (values) => {
    try {
      if (!isValid) {
        return;
      }
      setIsLoading(true);
      await replacePasswordApi(userInfo?._id, values);
      reset();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-md shadow-md">
      {(isSubmitting || loading) && <Loading />}
      <h3 className="text-center pb-5 text-xl font-bold border-b-2 border-primary-300">
        Thay Đổi Mật Khẩu
      </h3>
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="w-[60%] mx-auto my-5"
      >
        <div className="flex flex-col gap-5">
          <Field
            control={control}
            name="currentPassword"
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu hiện tại của bạn"
            isInputPassword
            errors={errors.currentPassword}
          />
          <Field
            control={control}
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            isInputPassword
            errors={errors.newPassword}
          />
          <Field
            control={control}
            name="confirmPassword"
            label="Xác nhật mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu mới"
            isInputPassword
            errors={errors.confirmPassword}
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
  );
};

export default ChangePasswordPage;

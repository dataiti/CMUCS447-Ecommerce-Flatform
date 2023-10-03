import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Field from "../../components/Field";
import { authSelect, registerAction } from "../../redux/features/authSlice";

const registerSchema = yup.object({
  username: yup.string().required("Bắt buộc !"),
  email: yup.string().required("Bắt buộc !").email("Sai định dạng email !"),
  password: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải ít nhất 8 kí tự !")
    .max(20, "Mật khẩu phải tối đa 20 kí tự !"),
});

const RegisterPage = () => {
  const [loading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmitSignUp = async (values) => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    dispatch(registerAction(values))
      .unwrap()
      .then(() => {
        reset();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSignUp)}
      className="w-[340px] px-8 pt-10 pb-14 rounded-3xl shadow-md bg-opacity border-2 border-white"
    >
      {(isSubmitting || loading) && <Loading />}
      <h3 className="text-center pb-5 text-3xl font-bold">Đăng Ký</h3>
      <div className="flex flex-col gap-5">
        <Field
          control={control}
          name="username"
          label="Tên người dùng"
          placeholder="Nhập tên người dùng"
          errors={errors.username}
        />
        <Field
          control={control}
          name="email"
          type="email"
          label="Địa chỉ email"
          placeholder="Nhập địa chỉ email"
          errors={errors.email}
        />
        <Field
          control={control}
          name="password"
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          isInputPassword
          errors={errors.password}
        />
        <Button
          type="submit"
          primary
          size="medium"
          className="w-full rounded-full text-base py-3 mt-2"
        >
          Đăng Ký
        </Button>
        <p className="text-gray-500 text-xs text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-cyan-900 font-extrabold underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authSelect, loginAction } from "../../redux/features/authSlice";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Field from "../../components/Field";
import SocialForm from "../../components/SocialForm";
import { toast } from "react-toastify";

const registerSchema = yup.object({
  email: yup.string().required("Bắt buộc !").email("Sai định dạng email !"),
  password: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải ít nhất 8 kí tự !")
    .max(20, "Mật khẩu phải tối đa 20 kí tự !"),
});

const LoginPage = () => {
  const [isLoading, setIsisLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(registerSchema),
  });

  const handleSubmitSignUp = async (values) => {
    if (!isValid) {
      return;
    }
    try {
      setIsisLoading(true);
      const res = await dispatch(loginAction(values));
      if (res && res.payload && res.payload.success) {
        toast.success("Đăng nhập thành công !");
        setResultMessage("");
      } else {
        setResultMessage("Email hoặc mật khẩu chưa chính xác !");
      }
      setIsisLoading(false);
    } catch (error) {
      setIsisLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSignUp)}
      className="w-[340px] px-8 pt-10 pb-14 rounded-3xl shadow-md bg-opacity border-2 border-white"
    >
      <h3 className="text-center pb-5 text-3xl font-bold">Đăng Nhập</h3>
      {(isSubmitting || isLoading) && <Loading />}
      <div className="flex flex-col gap-5">
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
        <Button primary className="w-full rounded-full text-base py-3 mt-2">
          Đăng Nhập
        </Button>
        {resultMessage && (
          <span className="mx-auto text-xs text-red-500">{resultMessage}</span>
        )}
      </div>
      <div className="mt-3 text-gray-500 flex items-center justify-between text-xs mx-5 font-extrabold">
        <Link to="">Quên mật khẩu ?</Link>
        <Link to="/register">Đăng ký ngay</Link>
      </div>
      <span className="text-xs text-gray-500 flex justify-center py-1 font-semibold">
        Hoặc
      </span>
      <SocialForm />
    </form>
  );
};

export default LoginPage;

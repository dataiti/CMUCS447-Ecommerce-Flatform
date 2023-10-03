import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { authSelect, loginAction } from "../../redux/features/authSlice";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Field from "../../components/Field";
import { clearTitleHeader } from "../../redux/features/titleSlice";

const registerSchema = yup.object({
  email: yup.string().required("Bắt buộc !").email("Sai định dạng email !"),
  password: yup
    .string()
    .required("Bắt buộc !")
    .min(8, "Mật khẩu phải ít nhất 8 kí tự !")
    .max(20, "Mật khẩu phải tối đa 20 kí tự !"),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isLoggedIn } = useSelector(authSelect);

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

  useEffect(() => {
    dispatch(clearTitleHeader());
  }, [dispatch]);

  const handleSubmitSignUp = async (values) => {
    if (!isValid) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await dispatch(loginAction(values));
      if (res && res.payload && res.payload.success) {
        toast.success("Đăng nhập thành công !");
        setResultMessage("");
      } else {
        setResultMessage("Email hoặc mật khẩu chưa chính xác !");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return userInfo.storeId ? (
      <Navigate to={`/shop/dashboard/${userInfo?.storeId}`} />
    ) : (
      <Navigate to={`/shop/create-shop`} />
    );
  }

  return (
    <div className="w-[320px] bg-white px-5 py-10 rounded-lg shadow-md">
      {(isSubmitting || isLoading) && <Loading />}
      <h3 className="text-center pb-5 text-3xl font-bold">Đăng Nhập</h3>
      <form onSubmit={handleSubmit(handleSubmitSignUp)}>
        <div className="flex flex-col gap-5">
          <Field
            control={control}
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email address"
            errors={errors.email}
          />
          <Field
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            isInputPassword
            errors={errors.password}
          />
          <Button
            primary
            size="medium"
            className="w-full rounded-full text-base py-3 mt-2"
          >
            Đăng Nhập
          </Button>
        </div>
        <div className="mt-3 text-gray-500 flex items-center justify-between text-xs mx-5 font-extrabold">
          <Link to="">Quên mật khẩu ?</Link>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

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
import { clearTitleHeader } from "../../redux/features/titleSlice";

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

  useEffect(() => {
    dispatch(clearTitleHeader());
  }, [dispatch]);

  const handleSubmitSignUp = async (values) => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    dispatch(registerAction(values))
      .unwrap()
      .then(() => {
        reset();
        navigate("/login");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-[320px] bg-white px-5 py-10 rounded-lg shadow-md">
      {(isSubmitting || loading) && <Loading />}
      <h3 className="text-center pb-5 text-3xl font-bold">Register</h3>
      <form onSubmit={handleSubmit(handleSubmitSignUp)}>
        <div className="flex flex-col gap-5">
          <Field
            control={control}
            name="username"
            label="User name"
            placeholder="Enter your username"
            errors={errors.username}
          />
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
            type="submit"
            primary
            size="medium"
            className="w-full rounded-full text-base py-3 mt-2"
          >
            Create account
          </Button>
          <p className="text-gray-500 text-xs text-center">
            Do you already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-900 font-extrabold underline"
            >
              Login now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

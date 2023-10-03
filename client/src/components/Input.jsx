import React, { memo, useState } from "react";
import { useController } from "react-hook-form";
import { icons } from "../utils/icons";

const Input = ({
  control,
  name = "",
  type = "text",
  placeholder = "",
  isInputPassword = false,
  className = "",
}) => {
  const [isShowPassword, setIsShowPassword] = useState(true);
  const { field } = useController({ control, defaultValue: "", name });

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative ">
      <input
        id={name}
        type={isShowPassword ? type : "text"}
        placeholder={placeholder}
        autoComplete="on"
        spellCheck={false}
        className={`bg-white px-5 py-3 w-full text-sm text-gray-500pl-5 pr-10 rounded-full border 
           border-gray-300 transition-all 
          outline-none select-none placeholder:text-sm ${className}`}
        {...field}
      />
      {isInputPassword && (
        <span
          className="absolute right-3 -translate-y-1/2 top-1/2 text-gray-600 cursor-pointer"
          onClick={handleShowPassword}
        >
          {isShowPassword ? (
            <icons.AiOutlineEye size={20} />
          ) : (
            <icons.AiOutlineEyeInvisible size={20} />
          )}
        </span>
      )}
    </div>
  );
};

export default memo(Input);

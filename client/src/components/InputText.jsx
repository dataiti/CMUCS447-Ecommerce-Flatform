import React, { memo, useState } from "react";

const Input = ({
  value,
  setValue,
  type = "text",
  placeholder = "",
  className = "",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      autoComplete="on"
      spellCheck={false}
      className={`bg-white px-5 py-3 w-full text-sm text-gray-500pl-5 pr-10 rounded-sm border 
           border-gray-300 transition-all 
          outline-none select-none placeholder:text-sm ${className}`}
      value={value}
      onChange={setValue}
    />
  );
};

export default memo(Input);

import React, { memo } from "react";

const Label = ({ label = "", name = "", className = "" }) => {
  return (
    <label
      className={`text-sm font-bold text-cyan-700 ${className}`}
      htmlFor={name}
    >
      {label}
    </label>
  );
};

export default memo(Label);

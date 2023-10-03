import React, { memo } from "react";
import { icons } from "../utils/icons";

const Label = ({ label = "", htmlFor = "", className = "", isRequired }) => {
  return (
    <>
      <label
        className={`text-base font-bold text-cyan-700 ${className}`}
        htmlFor={htmlFor}
      >
        {label}
      </label>
    </>
  );
};

export default memo(Label);

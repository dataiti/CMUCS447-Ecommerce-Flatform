import React, { memo } from "react";

const ContentRow = ({ children, className = "" }) => {
  return (
    <span
      className={`px-1 py-1 text-sm rounded-sm text-gray-900 flex justify-center  ${className}`}
    >
      {children}
    </span>
  );
};

export default memo(ContentRow);

import React, { memo } from "react";

const Avatar = ({ src = "", alt = "", className = "" }) => {
  return (
    <div className={`cursor-pointer h-12 w-12 ${className}`}>
      <img
        className="h-full w-full rounded-full object-cover border-2 border-primary-400"
        src={src}
        alt={alt}
      />
    </div>
  );
};

export default memo(Avatar);

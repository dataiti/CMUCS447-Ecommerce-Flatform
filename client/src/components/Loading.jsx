import React, { memo } from "react";

const isLoading = () => {
  return (
    <div className="h-screen w-screen fixed z-30 top-0 left-0 bg-slate-900 bg-opacity-75 transition-opacity">
      <div className="container">
        <div className="rainbow">::before ::after</div>
      </div>
    </div>
  );
};

export default memo(isLoading);

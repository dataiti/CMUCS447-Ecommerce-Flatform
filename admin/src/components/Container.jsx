import React from "react";

const Container = ({ children, className }) => {
  return (
    <div className={`bg-white border p-3 rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Container;

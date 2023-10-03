import React from "react";

const Radio = ({ id, value, checked, onChange }) => {
  return (
    <input
      id={id}
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default Radio;

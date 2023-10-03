import React, { memo } from "react";

const Checkbox = ({ id, name, value, checked, setChecked }) => {
  const handleCheckboxChange = (e) => {
    let copyArrChecked = [...checked];
    if (e.target.checked) {
      copyArrChecked = [...checked, e.target.value];
    } else {
      copyArrChecked.splice(checked.indexOf(e.target.value), 1);
    }
    setChecked(copyArrChecked);
  };

  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      value={value}
      checked={checked.includes(value)}
      onChange={handleCheckboxChange}
    />
  );
};

export default memo(Checkbox);

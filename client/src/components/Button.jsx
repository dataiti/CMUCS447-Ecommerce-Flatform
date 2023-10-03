import React, { memo } from "react";
import { Link } from "react-router-dom";

const primaryStyle =
  "text-sm text-white bg-primary-400 hover:bg-primary-500 transition-all";
const outlineStyle =
  "text-sm text-primary-400 border-2 border-primary-400 hover:bg-cyan-50 transition-all";

const Button = ({
  type = "",
  to = "",
  onClick = () => {},
  children,
  primary,
  outline,
  leftIcon,
  disable = false,
  className,
  props,
}) => {
  let Button = "button";

  const rest = {
    onClick: onClick,
    type: { type },
    ...props,
  };

  if (to) {
    Button = Link;
    rest.to = to;
  }

  if (disable) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  return (
    <Button
      className={`rounded-md min-h-[36px] min-w-[90px] flex items-center justify-center
        ${primary && `${primaryStyle}`} 
        ${outline && `${outlineStyle}`} ${className}`}
      {...rest}
    >
      {leftIcon && <div className="mr-2">{leftIcon}</div>}
      {<span className="">{children}</span>}
    </Button>
  );
};

export default memo(Button);

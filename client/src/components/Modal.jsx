import { memo, useEffect, useState } from "react";
import { icons } from "../utils/icons";
import Button from "./Button";

function Modal({
  children,
  title,
  classNameBtn,
  nameBtn,
  primary = false,
  outline = false,
  leftIcon,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        onClick={openModal}
        primary={primary}
        outline={outline}
        className={`${classNameBtn}`}
        leftIcon={leftIcon}
      >
        {nameBtn}
      </Button>
      {isOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <div className="relative rounded-lg mx-auto animate-pulse-custom">
              <div className="flex justify-end">
                <button onClick={closeModal} className="text-white">
                  <icons.IoCloseCircleSharp size={36} />
                </button>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-700">{title}</h2>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Modal);

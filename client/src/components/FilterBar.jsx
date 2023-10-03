import React, { memo, useState } from "react";
import { priceFilerBarItem, ratingItem } from "../utils/constant";
import Checkbox from "./Checkbox";
import Label from "./Label";
import { icons } from "../utils/icons";

const FilterBar = ({
  listCategories = [],
  checked,
  setChecked,
  priceChecked,
  ratingChecked,
  handleChangePriceRangeRadio,
  handleChangeRatingRadio,
  handleDeleteFilterSelected,
}) => {
  const [show, setShow] = useState({
    category: true,
    rating: true,
    price: true,
  });

  return (
    <div className="col-span-2 rounded-md border-2 border-white">
      <h3 className="px-2 py-3 text-sm rounded-sm text-teal-700 font-extrabold uppercase mb-1 bg-gray-200">
        Bộ Lọc Sản phẩm
      </h3>
      <div className="p-2  flex flex-col gap-4">
        <div className="">
          <div className="flex items-center justify-between">
            <Label
              label="Danh mục"
              className="font-extrabold text-base uppercase"
            />
            <span
              onClick={() =>
                setShow((prev) => ({ ...prev, category: !prev.category }))
              }
              className="cursor-pointer hover:text-gray-500 text-gray-400"
            >
              {show.category ? (
                <icons.BiChevronDown size={24} />
              ) : (
                <icons.BiChevronUp size={24} />
              )}
            </span>
          </div>
          {show.category &&
            listCategories.map((category) => (
              <div key={category?._id} className="flex items-center gap-2 my-2">
                <Checkbox
                  checked={checked}
                  setChecked={setChecked}
                  value={category?._id}
                  id={category?._id}
                  name="categoryId"
                />
                <Label
                  htmlFor={category?._id}
                  label={category?.name}
                  className="text-sm font-bold text-gray-500"
                />
              </div>
            ))}
        </div>
        <div className="">
          <div className="flex items-center justify-between">
            <Label
              label="Đánh giá"
              className="font-extrabold text-base uppercase"
            />
            <span
              onClick={() =>
                setShow((prev) => ({ ...prev, ...prev, rating: !prev.rating }))
              }
              className="cursor-pointer hover:text-gray-500 text-gray-400"
            >
              {show.rating ? (
                <icons.BiChevronDown size={24} />
              ) : (
                <icons.BiChevronUp size={24} />
              )}
            </span>
          </div>
          {show.rating &&
            ratingItem.map((rating) => (
              <div key={rating.id} className="flex items-center gap-2 my-2">
                <input
                  type="radio"
                  id={rating.id}
                  checked={rating.id === ratingChecked}
                  value={ratingChecked}
                  onChange={() => handleChangeRatingRadio(rating)}
                />
                <span className="text-xs text-gray-500">
                  ({rating.items.length}) sao
                </span>
                {rating.items.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="flex items-center gap-1 text-yellow-400"
                    >
                      <icons.FaStar size={16} />
                    </span>
                  );
                })}
              </div>
            ))}
        </div>
        <div className="">
          <div className="flex items-center justify-between">
            <Label
              label="Khoảng giá tiền"
              className="font-extrabold text-base uppercase"
            />
            <span
              onClick={() =>
                setShow((prev) => ({ ...prev, price: !prev.price }))
              }
              className="cursor-pointer hover:text-gray-500 text-gray-400"
            >
              {show.price ? (
                <icons.BiChevronDown size={24} />
              ) : (
                <icons.BiChevronUp size={24} />
              )}
            </span>
          </div>
          {show.price &&
            priceFilerBarItem.map((priceRange) => (
              <div key={priceRange.id} className="flex items-center gap-2 my-2">
                <input
                  type="radio"
                  id={priceRange.id}
                  checked={priceRange.id === priceChecked}
                  value={priceChecked}
                  onChange={() => handleChangePriceRangeRadio(priceRange)}
                />
                <Label
                  htmlFor={priceRange?._id}
                  label={priceRange?.display}
                  className="text-sm font-bold text-gray-500"
                />
              </div>
            ))}
        </div>
        <button
          type="submit"
          className="bg-slate-900 rounded-md text-white w-full text-sm py-2"
          onClick={handleDeleteFilterSelected}
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default memo(FilterBar);

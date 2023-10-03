import React, { memo } from "react";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../utils/fn";
import { icons } from "../utils/icons";

const ProductCardRow = ({ productInfo = {} }) => {
  return (
    <Link
      to={`/product-detail/${productInfo?._id}`}
      className="flex items-center gap-3 px-1 rounded-md bg-white cursor-pointer"
    >
      <img
        src={productInfo?.imagePreview}
        alt="imagePreview"
        className="h-[80px] w-[80px] object-cover rounded-md block border"
      />
      <div className="flex flex-col">
        <h4 className="text-gray-500 font-bold name text-sm">
          {productInfo?.name}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">Đã bán: </span>
            <span className="text">{productInfo?.sold}</span>
          </div>
          <div className="flex items-center gap-1">
            {productInfo?.rating && (
              <>
                <span className="text-sm">
                  {productInfo?.rating.toFixed(1)}
                </span>

                <span className="text-yellow-400">
                  <icons.FaStar size={12} />
                </span>
              </>
            )}
          </div>
        </div>

        {productInfo?.price ? (
          <div className="text-base font-bold">
            ₫ {numberWithCommas(productInfo?.price?.$numberDecimal)}
          </div>
        ) : (
          <div className="text-base font-bold">
            ₫ {numberWithCommas(productInfo?.minPrice?.$numberDecimal)} - ₫{" "}
            {numberWithCommas(productInfo?.maxPrice?.$numberDecimal)}
          </div>
        )}
      </div>
    </Link>
  );
};

export default memo(ProductCardRow);

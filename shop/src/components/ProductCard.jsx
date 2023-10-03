import React, { memo } from "react";
import { numberWithCommas } from "../utils/fn";
import { icons } from "../utils/icons";

const ProductCard = ({ productInfo = {} }) => {
  return (
    <div className="p-1 border rounded-md bg-white cursor-pointer">
      <div className="w-full h-[100px]">
        <img
          src={productInfo?.imagePreview}
          alt="imagePreview"
          className="h-full w-full object-cover rounded-md block border"
        />
      </div>
      <div className="p-2 flex flex-col gap-1">
        <h4 className="text-gray-500 font-bold name text-sm">
          {productInfo?.name}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">Đã bán: </span>
            <span className="text-xs">{productInfo?.sold}</span>
          </div>
          <div className="flex items-center gap-1">
            {productInfo?.rating && (
              <>
                <span className="text-xs">
                  {productInfo?.rating?.toFixed(1)}
                </span>

                <span className="text-yellow-400">
                  <icons.FaStar size={12} />
                </span>
              </>
            )}
          </div>
        </div>

        {productInfo?.price ? (
          <div className="text-sm font-bold">
            ₫ {numberWithCommas(productInfo?.price?.$numberDecimal)}
          </div>
        ) : (
          <div className="text-sm font-bold">
            ₫ {numberWithCommas(productInfo?.minPrice?.$numberDecimal)} - ₫{" "}
            {numberWithCommas(productInfo?.maxPrice?.$numberDecimal)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

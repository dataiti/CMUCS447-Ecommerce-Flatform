import React, { memo } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import ProductCard from "./ProductCard";

const SwiperSlideProducts = ({ listProducts = [] }) => {
  return (
    <div className="bg-orange-50 overflow-hidden rounded-md">
      <Swiper
        grabCursor={"true"}
        spaceBetween={8}
        slidesPerView={5}
        className=""
      >
        {listProducts?.length > 0 &&
          listProducts.map((product) => {
            return (
              <SwiperSlide key={product?._id} className="w-60">
                <div className="w-[10/5] flex items-center justify-center flex-col gap-2 rounded-md transition-all cursor-pointer">
                  <ProductCard productInfo={product} />
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default memo(SwiperSlideProducts);

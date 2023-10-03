import React, { memo } from "react";
import { SwiperSlide, Swiper } from "swiper/react";

const SliderListImage = ({ listSlides = [] }) => {
  return (
    <div className="p-1 shadow-sm bg-slate-300 overflow-hidden rounded-md">
      <Swiper
        grabCursor={"true"}
        spaceBetween={4}
        slidesPerView={7}
        className=""
      >
        {listSlides?.length > 0 &&
          listSlides.map((slide) => {
            return (
              <SwiperSlide key={slide?._id} className="w-60">
                <div className="w-[10/7] flex items-center justify-center flex-col gap-2 rounded-md bg-slate-200 hover:bg-slate-200/60 transition-all cursor-pointer">
                  <img
                    className="w-24 object-cover rounded-full"
                    src={slide?.image}
                    alt=""
                  />
                  <span className="text-sm text-gray-500">{slide?.name}</span>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default memo(SliderListImage);

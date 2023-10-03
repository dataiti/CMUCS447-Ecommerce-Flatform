import { memo, useRef } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper";
import { icons } from "../utils/icons";
import "swiper/swiper-bundle.min.css";

function Slider({ listBanner = [] }) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <div className="w-full rounded-md relative overflow-hidden">
      <Swiper
        spaceBetween={50}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        cssMode={true}
        slidesPerView={1}
        keyboard={true}
        modules={[Navigation, Autoplay, Pagination, Mousewheel, Keyboard]}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
        }}
      >
        {listBanner?.map((banner, index) => {
          return (
            <SwiperSlide key={banner.id || index}>
              <img src={banner} className="w-full rounded-md" alt="" />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className="absolute top-1/2 z-20 left-0 text-white -translate-y-1/2 bg-gray-500/50 py-4 cursor-pointer rounded-tr-md rounded-br-md"
        ref={navigationPrevRef}
      >
        <icons.IoIosArrowBack size={24} />
      </div>
      <div
        className="absolute top-1/2 z-20 right-0 text-white -translate-y-1/2 bg-gray-500/50 py-4 cursor-pointer rounded-tl-md rounded-bl-md"
        ref={navigationNextRef}
      >
        <icons.IoIosArrowForward size={24} />
      </div>
    </div>
  );
}

export default memo(Slider);

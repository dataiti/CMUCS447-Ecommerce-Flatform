import { useDispatch, useSelector } from "react-redux";
import React, { Suspense, useEffect, useState } from "react";
import { getListCategoriesApi } from "../../apis/category";
import { loyaltyProgramItem, sliderItem } from "../../utils/constant";
import banner1 from "../../assets/team-meber.jpg";
import banner2 from "../../assets/web-mobile.jpg";
import subBanner1 from "../../assets/sub-slide1.jpg";
import subBanner2 from "../../assets/sub-slide2.jpg";
import Slider from "../../components/Slider";
import SliderListImage from "../../components/SliderListImage";
import {
  getListProductsByUserThunkAction,
  productSelect,
} from "../../redux/features/productSlice";
import Loading from "../../components/Loading";
import { getListHotSellingProductsApi } from "../../apis/product";
import SwiperSlideProducts from "../../components/SwiperSlideProducts";

const ProductCard = React.lazy(() => import("../../components/ProductCard"));

const HomePage = () => {
  const [listCategories, setListCategories] = useState([]);
  const [limit, setLimit] = useState(20);
  const [loading, setIsLoading] = useState(false);
  const [listHotSellingProducts, setListHotSellingProducts] = useState([]);
  const [typeListProducts, setTypeListProducts] = useState("all");

  const dispatch = useDispatch();
  const { listMyProducts } = useSelector(productSelect);

  useEffect(() => {
    const fetchListCategoriesApi = async () => {
      const res = await getListCategoriesApi();
      if (res && res.data) {
        setListCategories(res.data);
      }
    };
    fetchListCategoriesApi();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchListProductByUserApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(getListProductsByUserThunkAction({ limit }));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchListProductByUserApi();
  }, [dispatch, limit]);

  useEffect(() => {
    const fetchListHotSellingProductsApi = async () => {
      try {
        setIsLoading(true);

        const res = await getListHotSellingProductsApi();
        if (res && res.data) {
          setListHotSellingProducts(res.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchListHotSellingProductsApi();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="w-full flex flex-col gap-6 pb-20">
        <div className="w-full grid grid-cols-10 gap-1 h-[291px]">
          <div className="col-span-7">
            <Slider listBanner={[banner1, banner2]} />
          </div>
          <div className="col-span-3 flex flex-col h-full gap-1">
            <img src={subBanner1} alt="" className="rounded-md h-[143px]" />
            <img src={subBanner2} alt="" className="rounded-md h-[143px]" />
          </div>
        </div>
        <div className="sticky z-10 top-[110px]">
          <SliderListImage listSlides={listCategories} />
        </div>
        <div className="h-28 w-[100%] bg-zinc-200 grid grid-cols-5 gap-5 p-2 rounded-sm">
          {loyaltyProgramItem.map((item, index) => {
            return (
              <div key={index} className="flex gap-2 items-center">
                <span className="p-2 bg-slate-300 rounded-md text-gray-700">
                  {item.icon}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">{item.display}</span>
                  <span className="text-xs text-gray-500 font-bold">
                    {item.subDisplay}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border bg-orange-50/70 px-2 py-4 rounded-md shadow-sm flex flex-col gap-3">
          <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
            Sản phẩm bán chạy
          </h4>
          <SwiperSlideProducts listProducts={listHotSellingProducts} />
        </div>
        <div className="flex items-center justify-center gap-7">
          <button
            className={`uppercase px-2 py-1 text-lg font-extrabold border-b-4 text-teal-700 ${
              typeListProducts === "all"
                ? "border-sky-600"
                : "border-transparent"
            }`}
            onClick={() => setTypeListProducts("all")}
          >
            tất cả sản phẩm
          </button>
          <button
            className={`uppercase px-2 py-1 text-lg font-extrabold border-b-4 text-teal-700 ${
              typeListProducts === "following"
                ? " border-sky-600"
                : "border-transparent"
            }`}
            onClick={() => setTypeListProducts("following")}
          >
            Shop đang theo dõi
          </button>
        </div>
        <div className="border bg-orange-50/70 px-2 py-4 rounded-md shadow-sm flex flex-col gap-3">
          <div className="grid grid-cols-6 gap-1">
            {listMyProducts?.length > 0 &&
              listMyProducts.map((product) => {
                return (
                  <Suspense fallback={<div>Loading...</div>} key={product?._id}>
                    <ProductCard productInfo={product} />
                  </Suspense>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

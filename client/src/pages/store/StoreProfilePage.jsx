import React, { Suspense, useEffect, useState } from "react";
import { icons } from "../../utils/icons";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../redux/features/authSlice";
import SwiperSlideProducts from "../../components/SwiperSlideProducts";
import { getListFeatureImagesApi, getStoreApi } from "../../apis/store";
import {
  getListHotSellingProductsByStoreApi,
  getListProductsFromStoreByUserApi,
} from "../../apis/product";
import Slider from "../../components/Slider";
import Button from "../../components/Button";
import Label from "../../components/Label";
import { covertToDate } from "../../utils/fn";
import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import { followStoreApi, unFollowStoreApi } from "../../apis/user";

const StoreProfilePage = () => {
  const [layout, setLayout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [listProductsSelling, setListProductsSelling] = useState([]);
  const [listProductsFromStore, setListProductsFromStore] = useState([]);
  const [profileStore, setProfileStore] = useState({});
  const [limit, setLimit] = useState(12);

  const { id } = useParams();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const res = await getStoreApi({
          storeId: id,
        });
        if (res && res.data) {
          setProfileStore(res.data);
          setLayout(res.data?.layoutImages);
        }

        const resListFeatureImage = await getListFeatureImagesApi({
          userId: userInfo?._id,
          storeId: id,
        });
        if (resListFeatureImage && resListFeatureImage.data) {
          setPreviewUrls(resListFeatureImage.data);
        }

        const resListHotSelling = await getListHotSellingProductsByStoreApi({
          userId: userInfo?._id,
          storeId: id,
        });
        if (resListHotSelling && resListHotSelling.data) {
          setListProductsSelling(resListHotSelling.data);
        }

        const resListProduct = await getListProductsFromStoreByUserApi({
          storeId: id,
          limit,
        });
        if (resListProduct && resListProduct.data) {
          setTotalProduct(resListProduct.coutProducts);
          setListProductsFromStore(resListProduct.data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [layout, id, limit]);


  const handleFollowingStore = async () => {};

  const handleUnFollowingStore = async () => {};

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loading />}
      <div className="bg-slate-200 rounded-sm p-4 border shadow-sm grid grid-cols-7 gap-8">
        <div className="col-span-3 flex items-center gap-3 bg-zinc-300 py-3 px-6 rounded-lg border-2 border-white">
          <img
            src={profileStore?.avatar}
            alt=""
            className="h-28 w-28 object-cover rounded-full border-4 border-slate-900"
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col text-slate-900">
              <span className="text-lg font-bold">{profileStore?.name}</span>
              <div className="text-base text-gray-500 font-semibold flex items-center">
                <span className="text-red-500">
                  <icons.IoLocationSharp />
                </span>{" "}
                {profileStore?.location}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isFollowing ? (
                <Button
                  outline
                  leftIcon={<icons.FaUserCheck />}
                  onClick={handleFollowingStore}
                  className="px-4"
                >
                  Đang Theo dõi
                </Button>
              ) : (
                <Button
                  outline
                  leftIcon={<icons.BsFillPersonPlusFill />}
                  onClick={handleUnFollowingStore}
                  className="px-4"
                >
                  Theo dõi
                </Button>
              )}
              <Button outline leftIcon={<icons.BsMessenger />}>
                Nhắn tin
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-2">
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.BsCameraFill size={18} />{" "}
            </span>
            <Label label="Sản phẩm: " />
            <p className="text-gray-500 text-sm font-bold">{totalProduct}</p>
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.FaUserFriends size={18} />{" "}
            </span>
            <Label label="Người theo dõi: " />
            <p className="text-gray-500 text-sm font-bold">
              {profileStore?.userFollowIds?.length}
            </p>
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.FaStar size={18} />{" "}
            </span>
            <Label label="Đánh giá: " />
            {profileStore?.rating && (
              <p className="text-gray-500 text-sm font-bold">
                {profileStore?.rating.toFixed(1)}
              </p>
            )}
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.FaUserCheck size={18} />{" "}
            </span>
            <Label label="Tham gia ngày: " />
            <p className="text-gray-500 text-sm font-bold">
              {covertToDate(profileStore?.createdAt)}
            </p>
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.IoLocationSharp size={18} />{" "}
            </span>
            <Label label="Vị trí: " />
            <p className="text-gray-500 text-sm font-bold">
              {profileStore?.location}
            </p>
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <span className="text-orange-800">
              <icons.BsFillPhoneVibrateFill size={18} />{" "}
            </span>
            <Label label="Số điện thoại: " />
            <p className="text-gray-500 text-sm font-bold">
              {profileStore?.phone}
            </p>
          </div>
        </div>
      </div>
      <div className="border bg-orange-50/70 px-2 py-2 rounded-md shadow-sm flex flex-col gap-3">
        <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
          Hình ảnh nổi bật
        </h4>
        {layout === "layout1" && (
          <div className="w-full mx-auto flex flex-col gap-1">
            <div className="w-full h-80 bg-gray-sencond">
              <div className="h-full overflow-hidden col-span-7 border rounded-sm flex items-center justify-center text-zinc-400/70 bg-white">
                <Slider listBanner={previewUrls} />
              </div>
            </div>
          </div>
        )}
        {layout === "layout2" && (
          <div className="w-full mx-auto flex flex-col gap-1">
            <div className="w-full h-80 bg-gray-sencond grid grid-cols-10 gap-2 shadow-sm">
              <div className="h-full overflow-hidden col-span-7 rounded-sm flex items-center justify-center text-zinc-400/70 bg-white">
                <img
                  src={previewUrls[0]}
                  alt=""
                  className="h-full w-full object-cover border rounded-sm shadow-sm"
                />
              </div>
              <div className="col-span-3 h-full flex flex-col gap-2">
                <img
                  src={previewUrls[1]}
                  alt=""
                  className="h-full w-full object-cover border rounded-sm shadow-sm"
                />
                <img
                  src={previewUrls[2]}
                  alt=""
                  className="h-full w-full object-cover border rounded-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
        {layout === "layout3" && (
          <div className="w-full mx-auto flex flex-col gap-1">
            <div className="w-full h-72 bg-gray-sencond grid grid-cols-3 gap-2 bg-slate-200">
              {previewUrls.slice(0, 3).map((url) => (
                <img
                  src={url}
                  alt="preview"
                  className="h-full w-full rounded-sm border border-gray-300"
                  key={url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {profileStore?.isShowProductsSelling && (
        <div className="border bg-orange-50/70 p-2 rounded-md shadow-sm flex flex-col gap-3">
          <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
            Sản phẩm bán chạy
          </h4>
          <SwiperSlideProducts listProducts={listProductsSelling} />
        </div>
      )}
      <div className="border bg-orange-50/70 px-2 py-4 rounded-md shadow-sm flex flex-col gap-3">
        <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
          Tất cả sản phẩm
        </h4>
        <div className="grid grid-cols-6 gap-1">
          {listProductsFromStore?.length > 0 &&
            listProductsFromStore.map((product) => {
              return (
                <Suspense fallback={<div>Loading...</div>} key={product?._id}>
                  <ProductCard productInfo={product} />
                </Suspense>
              );
            })}
        </div>
      </div>
      <div className="flex justify-center">
        <Button primary onClick={() => setLimit(limit + 12)} className="px-4">
          Xem thêm sản phẩm
        </Button>
      </div>
    </div>
  );
};

export default StoreProfilePage;

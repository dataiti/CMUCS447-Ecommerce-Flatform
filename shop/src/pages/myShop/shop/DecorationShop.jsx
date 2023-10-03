import React, { useEffect, useState } from "react";
import { icons } from "../../../utils/icons";
import {
  addFeatureImageApi,
  getListFeatureImagesApi,
  getProfileStoreApi,
  setLayoutFeatureImageApi,
  setShowHotProductSellingApi,
} from "../../../apis/store";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../../redux/features/authSlice";
import { Controller, useForm } from "react-hook-form";
import Slider from "../../../components/Slider";
import logo from "../../../assets/logo6.png";
import { getListHotSellingProductsByStoreApi } from "../../../apis/product";
import ProductCard from "../../../components/ProductCard";
import SwiperSlideProducts from "../../../components/SwiperSlideProducts";
import Footer from "../../../components/Footer";
import Loading from "../../../components/Loading";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import { covertToDate } from "../../../utils/fn";

const DecorationShop = () => {
  const [layout, setLayout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProductSelling, setShowProductSelling] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [listProductsSelling, setListProductsSelling] = useState([]);
  const [profileStore, setProfileStore] = useState({});

  const { control, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      images: [],
    },
  });

  const { id } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    dispatch(setTitleHeader("Trang trí Shop"));
  }, [dispatch]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const res = await getProfileStoreApi({
          userId: userInfo?._id,
          storeId: id,
        });
        if (res && res.data) {
          setProfileStore(res.data);
          setLayout(res.data?.layoutImages);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const res = await getListFeatureImagesApi({
          userId: userInfo?._id,
          storeId: id,
        });
        if (res && res.data) {
          setPreviewUrls(res.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [id, userInfo]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        if (showProductSelling) {
          const res = await getListHotSellingProductsByStoreApi({
            userId: userInfo?._id,
            storeId: id,
          });
          if (res && res.data) {
            setListProductsSelling(res.data);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [id, showProductSelling]);

  const handleSetLayout = async ({ layout }) => {
    try {
      const res = await setLayoutFeatureImageApi({
        userId: userInfo?._id,
        storeId: id,
        data: {
          layout,
        },
      });
      if (res && res.data) {
        setLayout(res.data);
      }
    } catch (error) {}
  };

  // const handleSetShowListProductsSelling = async () => {
  //   try {
  //     const res = await setShowHotProductSellingApi({
  //       userId: userInfo?._id,
  //       storeId: id,
  //     });
  //     if (res && res.data) {
  //       setShowProductSelling(!showProductSelling);
  //     }
  //   } catch (error) {}
  // };

  const handleSaveFutureImage = async () => {
    try {
      if (getValues().images.length === 0) {
        return;
      }
      setIsLoading(true);
      let formData = new FormData();
      for (let i = 0; i < getValues().images.length; i++) {
        formData.append("images", getValues().images[i]);
      }
      const res = await addFeatureImageApi({
        userId: userInfo?._id,
        storeId: id,
        formData,
      });
      if (res && res.data) {
        setPreviewUrls(res.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-10 h-full">
      {isLoading && <Loading />}
      <div className="col-span-7 bg-white mx-20 my-10 h-[600px] overflow-y-auto">
        <div className="bg-white rounded-sm flex flex-col gap-4">
          <div className="bg-primary-100 w-full">
            <div className="mx-auto bg-slate-900 ">
              <div className="w-[80%] mx-auto text-white uppercase text-xs py-1 flex items-center gap-4">
                <span>Trang chủ</span>
                <span>danh mục</span>
                <span>kênh bán hàng</span>
              </div>
            </div>
            <div className="w-[80%]  h-[70px] mx-auto flex items-center justify-between">
              <div className="text-xl font-extrabold text-primary-400 flex items-center">
                <img src={logo} alt="" className="h-10 w-10" />{" "}
                <span className="text-sm">CLICK SHOP</span>
              </div>
              <div className="flex-2 w-2/5 bg-gray-50 p-1 rounded-full flex items-center">
                <div type="text" className="outline-none flex-1 h-full pl-5" />
                <div className="bg-slate-400 p-1 rounded-full text-white transition-all">
                  <icons.FiSearch size={24} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-primary-400 relative">
                  <icons.BsFillBookmarkHeartFill size={30} />
                </span>
                <span className="text-primary-400 relative">
                  <icons.MdShoppingCart size={40} />
                  <span
                    className="absolute z-10 -top-2 -right-2 bg-white px-2 rounded-full font-extrabold
                      border border-primary-400"
                  >
                    4
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="w-[80%] mx-auto bg-slate-200 rounded-sm p-2 border shadow-sm grid grid-cols-7 gap-8">
            <div className="col-span-2 flex items-center gap-3 bg-zinc-300 p-2 rounded-lg border-2 border-white">
              <div className="h-10 w-10">
                <img
                  src={profileStore?.avatar}
                  alt=""
                  className="h-full w-full object-cover rounded-full border-2 border-slate-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col text-slate-900">
                  <span className="text-sm font-bold">
                    {profileStore?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-5 grid grid-cols-2">
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.BsCameraFill size={10} />{" "}
                </span>
                <Label label="Sản phẩm: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">0</p>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.FaUserFriends size={10} />{" "}
                </span>
                <Label label="Người theo dõi: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">
                  {profileStore?.userFollowIds?.length}
                </p>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.FaStar size={10} />{" "}
                </span>
                <Label label="Đánh giá: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">
                  {profileStore?.rating?.toFixed(1)}
                </p>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.FaUserCheck size={10} />{" "}
                </span>
                <Label label="Tham gia ngày: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">
                  {covertToDate(profileStore?.createdAt)}
                </p>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.IoLocationSharp size={10} />{" "}
                </span>
                <Label label="Vị trí: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">
                  {profileStore?.location}
                </p>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="text-orange-800">
                  <icons.BsFillPhoneVibrateFill size={10} />{" "}
                </span>
                <Label label="Số điện thoại: " className="text-xs" />
                <p className="text-gray-500 text-xs font-bold">
                  {profileStore?.phone}
                </p>
              </div>
            </div>
          </div>
          {layout === "layout1" && (
            <div className="w-[80%] mx-auto flex flex-col gap-1">
              {previewUrls.length <= 0 ? (
                <div className="w-full h-52 bg-gray-sencond p-3">
                  <div className="relative col-span-7 border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={32} />
                    </span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-400/70 py-2 text-white">
                      <icons.MdArrowBackIosNew />
                    </span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-400/70 py-2 text-white">
                      <icons.MdArrowForwardIos />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-52 bg-gray-sencond p-3">
                  <div className="h-full overflow-hidden col-span-7 border border-dashed border-zinc-400/70 rounded-sm flex items-center justify-center text-zinc-400/70 bg-white">
                    <Slider listBanner={previewUrls} />
                  </div>
                </div>
              )}
            </div>
          )}
          {layout === "layout2" && (
            <div className="w-[80%] mx-auto flex flex-col gap-1">
              {previewUrls.length === 0 ? (
                <div className="w-full h-52 bg-gray-sencond p-3 grid grid-cols-10 gap-1">
                  <div className="col-span-7 border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={32} />
                    </span>
                  </div>
                  <div className="col-span-3 h-full flex flex-col gap-1">
                    <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                      <span>
                        <icons.BsImageAlt size={32} />
                      </span>
                    </div>
                    <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                      <span>
                        <icons.BsImageAlt size={32} />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-52 bg-gray-sencond p-3 grid grid-cols-10 gap-1">
                  <div className="h-full overflow-hidden col-span-7 border border-dashed border-zinc-400/70 rounded-sm flex items-center justify-center text-zinc-400/70 bg-white">
                    <img
                      src={previewUrls[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="col-span-3 h-full flex flex-col gap-1">
                    <div className="flex-1 w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70 bg-white">
                      <img
                        src={previewUrls[1]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70 bg-white">
                      <img
                        src={previewUrls[2]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {layout === "layout3" && (
            <div className="w-[80%] mx-auto flex flex-col gap-1">
              {previewUrls.length === 0 ? (
                <div className="w-full h-52 bg-gray-sencond p-3 grid grid-cols-3 gap-1">
                  <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={32} />
                    </span>
                  </div>
                  <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={32} />
                    </span>
                  </div>
                  <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={32} />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-52 bg-gray-sencond p-3 grid grid-cols-3 gap-2">
                  {previewUrls.slice(0, 3).map((url) => (
                    <img
                      src={url}
                      alt="preview"
                      className="h-full w-full object-cover  rounded-sm border border-gray-300"
                      key={url}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {showProductSelling && (
            <div className="w-[80%] mx-auto p-3 bg-gray-sencond">
              <h4 className="uppercase font-bold text-teal-700 mb-2 text-sm">
                Sản phẩm bán chạy
              </h4>
              <div className="border border-dashed border-gray-400 rounded-md">
                <SwiperSlideProducts listProducts={listProductsSelling} />
              </div>
            </div>
          )}
          <div className="w-[80%] mx-auto p-3 bg-gray-sencond rounded-sm flex gap-2">
            <div className="flex gap-2">
              <div className="">
                <h3 className="text-gray-400 mb-5">DANH MỤC</h3>
                <ul className="flex flex-col gap-4 text-gray-400 text-sm">
                  <li>Tất cả sản phẩm</li>
                  <li>Mới nhất</li>
                  <li>Mua nhiều</li>
                </ul>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-7 bg-gray-400 mb-2 rounded-sm"></div>
              <div className="grid grid-cols-5 gap-2">
                <div className="bg-white col-span-1 flex items-center justify-center text-gray-400 rounded-sm py-14">
                  <icons.BsFillBagCheckFill size={20} />
                </div>
                <div className="bg-white col-span-1 flex items-center justify-center text-gray-400 rounded-sm py-14">
                  <icons.BsFillBagCheckFill size={20} />
                </div>
                <div className="bg-white col-span-1 flex items-center justify-center text-gray-400 rounded-sm py-14">
                  <icons.BsFillBagCheckFill size={20} />
                </div>
                <div className="bg-white col-span-1 flex items-center justify-center text-gray-400 rounded-sm py-14">
                  <icons.BsFillBagCheckFill size={20} />
                </div>
                <div className="bg-white col-span-1 flex items-center justify-center text-gray-400 rounded-sm py-14">
                  <icons.BsFillBagCheckFill size={20} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      </div>
      <div className="col-span-3 bg-white px-6 py-2 rounded-sm border h-[calc(100vh-70px)]">
        <div className="h-[80%] overflow-y-auto px-2">
          <div className="flex flex-col gap-1">
            <h4 className="text-teal-600 uppercase font-bold text-sm">
              Hình Ảnh Nổi Bật (3 hình ảnh)
            </h4>
            <div
              className="flex flex-col gap-1 hover:opacity-70 cursor-pointer"
              onClick={() => handleSetLayout({ layout: "layout1" })}
            >
              <div
                className={`w-full h-32 bg-gray-sencond p-3 ${
                  layout === "layout1" && "border border-blue-500"
                } `}
              >
                <div className="relative border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                  <span>
                    <icons.BsImageAlt size={32} />
                  </span>
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-zinc-400/70 py-2 text-white">
                    <icons.MdArrowBackIosNew />
                  </span>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-400/70 py-2 text-white">
                    <icons.MdArrowForwardIos />
                  </span>
                </div>
              </div>
              <div className="text-center text-gray-400 text-xs italic">
                Banner xoay vòng (3 hình ảnh)
              </div>
            </div>
            <div
              className="flex flex-col gap-1 hover:opacity-70 cursor-pointer"
              onClick={() => handleSetLayout({ layout: "layout2" })}
            >
              <div
                className={`w-full h-32 bg-gray-sencond p-3 grid grid-cols-10 gap-1 ${
                  layout === "layout2" && "border border-blue-500"
                } `}
              >
                <div className="col-span-7 border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                  <span>
                    <icons.BsImageAlt size={32} />
                  </span>
                </div>
                <div className="col-span-3 h-full flex flex-col gap-1">
                  <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={12} />
                    </span>
                  </div>
                  <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                    <span>
                      <icons.BsImageAlt size={12} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center text-gray-400 text-xs italic">
                3 hình ảnh
              </div>
            </div>
            <div
              className="flex flex-col gap-1 hover:opacity-70 cursor-pointer"
              onClick={() => handleSetLayout({ layout: "layout3" })}
            >
              <div
                className={`w-full h-32 bg-gray-sencond p-3 grid grid-cols-3 gap-1 ${
                  layout === "layout3" && "border border-blue-500"
                } `}
              >
                <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                  <span>
                    <icons.BsImageAlt size={32} />
                  </span>
                </div>
                <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                  <span>
                    <icons.BsImageAlt size={32} />
                  </span>
                </div>
                <div className="w-full border border-dashed border-zinc-400/70 rounded-sm h-full flex items-center justify-center text-zinc-400/70">
                  <span>
                    <icons.BsImageAlt size={32} />
                  </span>
                </div>
              </div>
              <div className="text-center text-gray-400 text-xs italic">
                3 hình ảnh
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-teal-600 uppercase font-bold text-sm">
              Sản phẩm Bán Chạy (tự động)
            </h4>
            <div
              className={`grid grid-cols-3 gap-1 hover:opacity-70 cursor-pointer border  ${
                showProductSelling ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setShowProductSelling(!showProductSelling)}
            >
              <div className="w-full col-span-1 bg-white h-32 border border-gray-300 p-1 rounded-sm">
                <span className="flex justify-center items-center text-zinc-400/70 h-16 bg-gray-sencond">
                  <icons.BsImageAlt size={16} />
                </span>
                <div className="flex flex-col gap-2 py-2">
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                </div>
              </div>
              <div className="col-span-1 bg-white h-32 border border-gray-300 p-1 rounded-sm">
                <span className="flex justify-center items-center text-zinc-400/70 h-16 bg-gray-sencond">
                  <icons.BsImageAlt size={16} />
                </span>
                <div className="flex flex-col gap-2 py-2">
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                </div>
              </div>
              <div className="col-span-1 bg-white h-32 border border-gray-300 p-1 rounded-sm">
                <span className="flex justify-center items-center text-zinc-400/70 h-16 bg-gray-sencond">
                  <icons.BsImageAlt size={16} />
                </span>
                <div className="flex flex-col gap-2 py-2">
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                  <p className="h-1 bg-gray-sencond w-[80%]"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[18%] w-full p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-teal-600 uppercase font-bold text-sm">
              CHọn hình ảnh (3 hình ảnh)
            </h4>
            <label
              className="text-white cursor-pointer bg-slate-900 px-2 py-1 rounded-sm flex flex-col items-center justify-center"
              htmlFor="images"
            >
              <icons.RiImageAddFill size={15} />
            </label>
            <button
              className="px-2 rounded-sm text-white text-sm bg-slate-900"
              onClick={handleSaveFutureImage}
            >
              Lưu
            </button>
          </div>
          <div className=" bg-slate-100 border border-dashed border-gray-300 h-full">
            <Controller
              name="images"
              control={control}
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <>
                  <input
                    id="images"
                    type="file"
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => {
                      const newPreviewUrls = [];
                      for (let i = 0; i < e.target.files.length; i++) {
                        const file = e.target.files[i];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          newPreviewUrls.push(reader.result);
                          setPreviewUrls(newPreviewUrls);
                        };
                        reader.readAsDataURL(file);
                      }
                      return onChange(e.target.files);
                    }}
                    ref={ref}
                    multiple
                    hidden
                  />
                </>
              )}
            />
            <div className="h-24 w-full flex items-center gap-2 p-2 overflow-hidden">
              {previewUrls.slice(0, 5).map((url) => (
                <img
                  src={url}
                  alt="preview"
                  className="h-20 w-20 rounded-sm shadow-md"
                  key={url}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationShop;

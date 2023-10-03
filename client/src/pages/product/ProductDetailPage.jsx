import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../../components/Loading";
import Label from "../../components/Label";
import Button from "../../components/Button";
import { authSelect } from "../../redux/features/authSlice";
import { icons } from "../../utils/icons";

import { addCartThunkAction } from "../../redux/features/cartSlice";
import {
  getListProductsByCategoryApi,
  getProductDetailApi,
} from "../../apis/product";
import { numberWithCommas } from "../../utils/fn";
import OtherProductStore from "../../components/OtherProductStore";
import ProductCard from "../../components/ProductCard";
import { getListReviewByProductApi } from "../../apis/review";
import Avatar from "../../components/Avatar";
import { covertToDate } from "../../utils/fn";
import { ratingItem } from "../../utils/constant";

const ProductDetailPage = () => {
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageProductPreview, setImageProductPreview] = useState("");
  const [priceCart, setPriceCart] = useState("");
  const [priceProduct, setPriceProduct] = useState("");
  const [storeId, setStoreId] = useState("");
  const [inventory, setInventory] = useState("");
  const [message, setMessage] = useState("");
  const [quantityCart, setQuantityCart] = useState(0);
  const [limit, setLimit] = useState(10);
  const [categoryId, setCategoryId] = useState("");
  const [listProductByCategory, setListProductByCategory] = useState([]);
  const [listReviews, setListReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState([]);
  const [ratingChecked, setRatingChecked] = useState("");
  const [rating, setRating] = useState("");
  const [limitReview, setLimitReview] = useState(4);

  const [selectedOption, setSelectedOption] = useState({
    color: "",
    size: "",
  });

  const { id } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);

  useEffect(() => {
    const fetchProductDetailApi = async () => {
      try {
        setIsLoading(true);
        const res = await getProductDetailApi(id);
        if (res && res.data) {
          setProductData(res.data);
          setImageProductPreview(res.data.imagePreview);
          setPriceProduct(
            res.data?.minPrice?.$numberDecimal !==
              res.data?.maxPrice?.$numberDecimal
              ? `${res.data?.minPrice?.$numberDecimal} - ${res.data?.maxPrice?.$numberDecimal}`
              : res.data?.price?.$numberDecimal
          );
          setStoreId(res.data?.storeId?._id);
          if (res.data.optionStyles.length === 0) {
            setPriceCart(Number(res.data?.price?.$numberDecimal));
          }
          setCategoryId(res.data?.categoryId?._id);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchProductDetailApi();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchListReviewsApi = async () => {
      try {
        if (id && storeId) {
          const res = await getListReviewByProductApi({
            limit: limitReview,
            rating,
            productId: id,
            storeId: storeId,
          });
          if (res && res.data) {
            setListReviews(res.data);
            setTotalReviews(res.count);
          }
        }
      } catch (error) {}
    };
    fetchListReviewsApi();
  }, [id, storeId, rating, limitReview]);

  useEffect(() => {
    const fetchListProductsByCategoryApi = async () => {
      try {
        const res = await getListProductsByCategoryApi({
          categoryId,
          limit,
        });
        if (res && res.data) {
          setListProductByCategory(res.data);
        }
      } catch (error) {}
    };
    fetchListProductsByCategoryApi();
  }, [id, categoryId]);

  function handleColorClick(colorName) {
    setSelectedOption((prevOption) => ({
      ...prevOption,
      color: colorName,
      size: "",
    }));
  }

  function handleSizeClick(sizeName) {
    const selectedSize =
      selectedOption.color !== "" &&
      productData.optionStyles
        .find((option) => option.name === selectedOption.color)
        .optionStylesItem.find((option) => option.name === sizeName);
    setSelectedOption((prevOption) => ({
      ...prevOption,
      size: sizeName,
    }));
    setPriceCart(selectedSize?.price || 0);
    setInventory(selectedSize?.quantity || 0);
  }

  const handleAddProductToCart = async () => {
    try {
      if (quantityCart === 0 || !priceCart) {
        setMessage("Vui lòng chọn đầy đủ số lượng và phân loại sản phẩm");
        return;
      }
      setMessage("");
      setIsLoading(true);
      const optionStyle = {
        option1: selectedOption.color,
        option2: selectedOption.size,
      };
      const res = await dispatch(
        addCartThunkAction({
          userId: userInfo?._id,
          data: {
            optionStyle:
              selectedOption.color && selectedOption.size
                ? JSON.stringify(optionStyle)
                : JSON.stringify({}),
            productId: productData?._id,
            storeId: productData?.storeId?._id,
            quantity: quantityCart,
            price: priceCart,
          },
        })
      );
      if (res && res.payload && res.payload.success) {
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm vào giỏ hàng",
          icon: "success",
          confirmButtonText: "OK",
        });
        setQuantityCart(0);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangeRatingRadio = (rating) => {
    setRatingChecked(rating.count);
    setRating(rating.count);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {isLoading && <Loading />}
      <div className="bg-white rounded-sm p-5 flex flex-col gap-4 border">
        <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
          Thông tin sản phẩm
        </h4>
        <div className=" grid grid-cols-10 gap-10">
          <div className="col-span-4 flex flex-col gap-3">
            <div className="col-span-4 h-[430px] p-2 border-2 rounded-sm">
              <img
                src={imageProductPreview}
                alt=""
                className="rounded-sm object-cover w-full h-full"
              />
            </div>
            <div className="p-2 border-2 overflow-hidden rounded-sm">
              <Swiper
                grabCursor={"true"}
                spaceBetween={4}
                slidesPerView={5}
                className=""
              >
                {productData?.listImages?.length > 0 &&
                  productData?.listImages.map((image, index) => {
                    return (
                      <SwiperSlide key={index} className="">
                        <div
                          className={`w-[10/5] cursor-pointer ${
                            image === imageProductPreview
                              ? "border-2 border-sky-500 rounded-sm"
                              : "opacity-60 border-2"
                          }`}
                          onMouseOver={() => setImageProductPreview(image)}
                        >
                          <img
                            className="w-full object-cover rounded-sm"
                            src={image}
                            alt=""
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
          <div className="col-span-6 flex flex-col gap-4">
            <span className="text-teal-700 flex items-center gap-2 font-semibold">
              <icons.FaStoreAlt size={24} /> {productData?.storeId?.name}
            </span>
            <p className="text-slate-900 font-bold text-3xl tracking-wide name-product">
              {productData?.name}
            </p>
            <div className="flex items-center gap-4 text-base text-gray-600 font-semibold">
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 flex items-center justify-center">
                  <icons.FaStar size={20} />
                </span>
                {productData?.rating && (
                  <span> {productData?.rating.toFixed(1)} Xếp hạng</span>
                )}
              </span>
              |<span>{totalReviews} Đánh giá</span>|
              <span>{productData?.sold} Đã bán</span>
            </div>
            <div className="grid grid-cols-4">
              <Label label="Kho: " className="col-span-1" />
              <p className="col-span-3 text-slate-900 text-xl font-bold">
                {inventory || productData?.totalQuantity}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <Label label="Giá tiền: " className="col-span-1" />
              <p className="col-span-3 text-teal-600 text-[40px] font-bold flex items-center gap-4">
                {numberWithCommas(priceCart) || numberWithCommas(priceProduct)}
                <span className="text-slate-900 text-xl font-bold">VND</span>
              </p>
            </div>
            <div className="">
              {!selectedOption.color && productData.optionStyles && (
                <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                  <span className="text-yellow-500">
                    <icons.IoWarning size={20} />
                  </span>
                  Vui lòng chọn loại phân loại 1 để xem số lượng và giá tiền của
                  sản phẩm
                </div>
              )}
            </div>
            <div className="grid grid-cols-4">
              {productData?.optionStyles?.length > 0 && (
                <Label label="Phân loại nhóm 1: " className="col-span-1" />
              )}
              <div className="col-span-3 flex items-center gap-2 flex-wrap">
                {productData?.optionStyles?.map((option) => (
                  <button
                    className={`px-4  py-2 rounded-sm font-bold text-gray-500 ${
                      selectedOption.color === option.name
                        ? "bg-slate-600 text-white"
                        : "bg-slate-200 hover:bg-slate-300/80 transition-all"
                    }`}
                    key={option._id}
                    onClick={() => handleColorClick(option.name)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              {selectedOption.color !== "" && (
                <div className="grid grid-cols-4">
                  {productData?.optionStyles?.length > 0 && (
                    <Label label="Phân loại nhóm 2: " className="col-span-1" />
                  )}
                  <div className="col-span-3 flex items-center gap-2 flex-wrap">
                    {productData.optionStyles
                      .find((option) => option.name === selectedOption.color)
                      .optionStylesItem.map((option) => (
                        <button
                          className={`px-4  py-2 rounded-sm font-bold text-gray-500 ${
                            selectedOption.size === option.name
                              ? "bg-slate-600 text-white"
                              : "bg-slate-200 hover:bg-slate-300/80 transition-all"
                          }`}
                          key={option._id}
                          onClick={() => handleSizeClick(option.name)}
                          disabled={option.quantity === 0}
                        >
                          {option.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4">
              <Label label="Số lượng: " className="col-span-1" />
              <div className="col-span-3 flex items-center text-lg font-semibold">
                <button
                  className="bg-gray-300 w-8 h-8 text-white rounded-tl-sm rounded-bl-sm"
                  onClick={() =>
                    setQuantityCart((prev) => (prev === 0 ? 0 : prev - 1))
                  }
                >
                  -
                </button>
                <input
                  className="w-16 outline-none text-[15px]  text-center text-gray-500 bg-slate-100 h-8 border border-gray-300"
                  type="number"
                  value={quantityCart}
                  onChange={(e) => setQuantityCart(Number(e.target.value))}
                />
                <button
                  className="bg-gray-300 w-8 h-8 text-white rounded-tr-sm rounded-br-sm"
                  onClick={() => setQuantityCart((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="relative mt-4">
              {message && (
                <p className="absolute bottom-[116%] text-xs font-semibold text-red-500">
                  {message}
                </p>
              )}
              <Button
                primary
                className="py-4 px-4 rounded-full w-52 "
                onClick={handleAddProductToCart}
              >
                Thêm vào Giỏ Hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-sm grid grid-cols-10 gap-10 p-5 border">
        <div className="col-span-4 flex flex-col gap-4">
          <div className="p-2 bg-slate-200 rounded-md flex items-center gap-2">
            <img
              src={productData?.storeId?.avatar}
              alt=""
              className="w-16 h-16 rounded-md"
            />
            <div className="flex flex-col text-slate-900">
              <span className="text-lg font-bold">
                {productData?.storeId?.name}
              </span>
              <div className="text-base text-gray-500 font-semibold flex items-center">
                <span className="text-red-500">
                  <icons.IoLocationSharp />
                </span>{" "}
                {productData?.storeId?.location}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                outline
                to={`/profile-store/${productData?.storeId?._id}`}
              >
                Xem Shop
              </Button>
              <Button outline className="px-3">
                Nhắn tin Shop
              </Button>
            </div>
          </div>
          <OtherProductStore storeId={storeId} setIsLoading={setIsLoading} />
        </div>
        <div className="col-span-6">
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <Label label="Mô tả sản phẩm" className="" />
            <div>
              {(productData.description && parse(productData.description)) ||
                ""}
            </div>
          </div>
        </div>
      </div>
      {listReviews?.length > 0 && (
        <div className="bg-white rounded-sm p-5 flex flex-col gap-4 border">
          <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
            Nhận xét - Đánh giá từ khách hàng đã mua
          </h4>
          <div className="bg-white rounded-md">
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-1 flex flex-col gap-1">
                <div className="w-full h-36 bg-yellow-50 rounded-md border-2 border-yellow-400">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[40px] font-bold">
                      {productData?.rating?.toFixed(1)} / 5
                    </span>
                    <span className="text-yellow-500">
                      <icons.FaStar size={30} />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-gray-500">
                      ({totalReviews}) Lượt đánh giá
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  {ratingItem.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex items-center gap-2 my-2"
                    >
                      <input
                        type="radio"
                        id={rating.count}
                        checked={rating.count === ratingChecked}
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
              </div>
              <div className="col-span-4">
                <div className="flex flex-col gap-6">
                  {listReviews?.length > 0 &&
                    listReviews.map((review) => {
                      return (
                        <div
                          key={review?._id}
                          className="border-b flex flex-col gap-3 bg-slate-200/80 rounded-md p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar src={review?.authorId?.avatar} />
                            <div className="flex gap-1 flex-col">
                              <p className="text-base font-bold text-gray-600">
                                {review?.authorId?.displayName ||
                                  review?.authorId?.username}
                              </p>
                              <div className="flex items-center gap-3">
                                <p className="text-sm font-semibold text-gray-400">
                                  {covertToDate(review?.createdAt)}
                                </p>
                                |
                                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                  <span className="text-yellow-500">
                                    <icons.FaStar size={14} />
                                  </span>
                                  ({review?.rating}) Xếp hạng
                                </p>
                                {review?.orderId?.optionStyle?.option1 &&
                                  review?.orderId?.optionStyle?.option2 && (
                                    <>|</>
                                  )}
                                {review?.orderId?.optionStyle?.option1 &&
                                  review?.orderId?.optionStyle?.option2 && (
                                    <div className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                      Phân loại:
                                      <p className="text-teal-700 font-bold">
                                        {`${review?.orderId?.optionStyle?.option1} -
                                        ${review?.orderId?.optionStyle?.option2}`}
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          {review.listImages.length > 0 && (
                            <div className="flex items-center gap-2">
                              {review.listImages.map((image, index) => {
                                return (
                                  <img
                                    src={image}
                                    alt=""
                                    key={index}
                                    className="h-20 w-20 object-cover border"
                                  />
                                );
                              })}
                            </div>
                          )}
                          <div className="px-5 py-3 rounded-3xl bg-white">
                            <p>{review?.content}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
                {listReviews?.length > 0 && (
                  <div className="flex justify-center my-2">
                    <Button
                      outline
                      onClick={() => setLimitReview((prev) => prev + 4)}
                      className="px-3 rounded-full"
                    >
                      Xem them
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-sm p-4 flex flex-col gap-4 border">
        <h4 className="uppercase text-lg font-extrabold bg text-teal-700">
          Sản phẩm Tương tự
        </h4>
        <div className="grid grid-cols-6 gap-1">
          {listProductByCategory?.length > 0 &&
            listProductByCategory.map((product) => {
              return (
                <Suspense fallback={<div>Loading...</div>} key={product?._id}>
                  <ProductCard productInfo={product} />
                </Suspense>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

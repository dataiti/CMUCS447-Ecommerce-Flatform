import React, { useState } from "react";
import Label from "./Label";
import { ratingItem } from "../utils/constant";
import { icons } from "../utils/icons";
import Button from "./Button";
import { Controller, useForm } from "react-hook-form";
import { createReviewApi } from "../apis/review";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Review = ({ storeId, authorId, productId, orderId }) => {
  const [ratingChecked, setRatingChecked] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [content, setContent] = useState("");

  const { control, getValues } = useForm();

  const navigate = useNavigate();

  const handleChangeRatingRadio = (rating) => {
    setRatingChecked(rating.count);
    setRating(rating.count);
  };

  const handleCreateReviewOrder = async () => {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("content", content);
      formData.append("rating", Number(rating));
      formData.append("orderId", orderId);
      formData.append("productId", productId);
      formData.append("storeId", storeId);
      if (getValues().images.length > 0) {
        for (let i = 0; i < getValues().images.length; i++) {
          formData.append("images", getValues().images[i]);
        }
      }

      for (const value of formData.values()) {
      }
      const res = await createReviewApi({ userId: authorId, formData });
      if (res && res.success) {
        toast.success(`Đã đánh giá đơn hàng # ...${orderId.slice(-4)}`);
        setIsLoading(false);
        navigate("/profile/list-orders");
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[400px] bg-opacity rounded-2xl border-2 border-white p-5">
      <h4 className="uppercase text-sm font-bold text-teal-700 text-center">
        Đánh Giá Sản Phẩm
      </h4>
      <div>
        <Label label="Lượt Đánh Giá" className="text-sm" />

        {ratingItem.map((rating) => (
          <div key={rating.id} className="flex items-center gap-2 my-2">
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
      <div>
        <Label label="Hình Ảnh Đánh Giá" className="text-sm" />
        <div className=" bg-slate-100 border-2 border-dashed border-teal-600 h-full rounded-md group relative">
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <>
                {previewUrls.length > 0 ? (
                  <>
                    <label
                      htmlFor="images"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-100 text-gray-500 cursor-pointer p-4 bg-slate-200 rounded-full opacity-0 transition-all"
                    >
                      <icons.AiFillPlusCircle size={40} />
                    </label>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="images"
                      className="absolute p-4 text-gray-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-slate-200 rounded-full"
                    >
                      <icons.AiFillPlusCircle size={40} />
                    </label>
                  </>
                )}
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

      <div className="flex gap-2 flex-col">
        <Label label="Nội Dung Đánh Giá" className="text-sm" />
        <textarea
          placeholder="Nhập Nội Dung Đánh Giá"
          className="text-sm font-semibold rounded-md p-4 outline-none placeholder:text-sm placeholder:font-semibold"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="flex justify-center my-2">
        <Button
          primary
          className="rounded-full px-4"
          onClick={handleCreateReviewOrder}
        >
          Gửi Đánh Giá
        </Button>
      </div>
    </div>
  );
};

export default Review;

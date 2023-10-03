import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import Button from "../../../components/Button";
import Field from "../../../components/Field";
import Quill from "../../../components/Quill";
import Label from "../../../components/Label";
import { icons } from "../../../utils/icons";
import { createCategoryThunkAction } from "../../../redux/features/categorySlice";
import Loading from "../../../components/Loading";
import { setTitleHeader } from "../../../redux/features/titleSlice";

const createCategorySchema = yup.object({
  name: yup.string().required("Bắt buộc !"),
});

const CreateCategory = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [fileImage, setFileImage] = useState({});

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(createCategorySchema),
  });

  const handleSelectedImagePreview = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFileImage(file);
    }
  };

  useEffect(() => {
    dispatch(setTitleHeader("Thêm danh mục sản phẩm"));
  }, [dispatch]);

  const handleSubmitCreateCategory = async (values) => {
    try {
      if (!isValid) return;
      setIsLoading(true);
      let formData = new FormData();

      formData.append("image", fileImage);
      formData.append("name", values.name);
      formData.append("description", content);
      await dispatch(createCategoryThunkAction(formData));
      Swal.fire({
        title: "Thành công",
        text: "Thêm danh mục thành công",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      setImagePreview("");
      setFileImage({});
      setContent("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-[140px] my-[100px]">
      {(isLoading || isSubmitting) && <Loading />}
      <form
        className="w-full p-5 rounded-md bg-white "
        onSubmit={handleSubmit(handleSubmitCreateCategory)}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-5 col-span-2">
            <Field
              control={control}
              name="name"
              type="text"
              label="Tên danh mục"
              placeholder="Nhập tên danh mục mới"
              errors={errors.name}
            />
            <div>
              <Label label="Mô tả" />
              <Quill content={content} setContent={setContent} />
            </div>
          </div>
          <div className="col-span-1">
            <Label label="Hình ảnh" />
            <div className="rounded-sm border border-dashed border-gray-300 h-[286px] flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="image"
                  className="object-cover h-full w-full"
                />
              ) : (
                <>
                  <label
                    className="text-gray-500 cursor-pointer p-6 bg-slate-200 rounded-full"
                    htmlFor="image"
                  >
                    <icons.BsCameraFill size={40} />
                  </label>
                  <input
                    id="image"
                    type="file"
                    hidden
                    onChange={handleSelectedImagePreview}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-4">
          <Button primary size="medium" className="text-base py-3 px-2 ">
            Thêm danh mục
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;

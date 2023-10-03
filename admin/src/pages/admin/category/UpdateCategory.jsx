import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Button from "../../../components/Button";

import Field from "../../../components/Field";
import Quill from "../../../components/Quill";
import Label from "../../../components/Label";
import { icons } from "../../../utils/icons";
import {
  categorySelect,
  createCategoryThunkAction,
  getCategoryThunkAction,
  updateCategoryThunkAction,
} from "../../../redux/features/categorySlice";
import Loading from "../../../components/Loading";
import { useParams } from "react-router-dom";

const createCategorySchema = yup.object({
  name: yup.string().required("Bắt buộc !"),
  description: yup.string(),
});

const UpdateCategory = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [fileImage, setFileImage] = useState({});

  const { id } = useParams();

  const dispatch = useDispatch();
  const { category } = useSelector(categorySelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(createCategorySchema),
  });

  useEffect(() => {
    const featchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(getCategoryThunkAction(id));
        setImagePreview(category.image);
        reset({ category });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    featchApi();
  }, [id, dispatch]);

  const handleSelectedImagePreview = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFileImage(file);
    }
  };

  const handleSubmitCreateCategory = async (values) => {
    try {
      if (!isValid) return;
      setIsLoading(true);
      let formData = new FormData();

      formData.append("image", fileImage);
      formData.append("name", values.name);
      formData.append("description", content);
      await dispatch(updateCategoryThunkAction({ id, formData }));
      Swal.fire({
        title: "Thành công",
        text: "Chỉnh sửa danh mục thành công",
        icon: "success",
        confirmButtonText: "OK",
      });
      reset();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-[140px] py-[60px]">
      {(isLoading || isSubmitting) && <Loading />}
      <h3 className="text-2xl text-primary-400 mb-4">Chỉnh sửa Danh Mục</h3>
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
            <div className="relative rounded-sm border border-dashed border-gray-300 h-[286px] flex items-center justify-center group">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="image"
                  className="object-cover h-full w-full"
                />
              )}
              <>
                <label
                  className="absolute group hover:opacity-100 text-gray-500 cursor-pointer p-6 bg-slate-200 rounded-full opacity-0 transition-all"
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
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-4">
          <Button primary size="medium" className="text-base py-3 px-2 ">
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;

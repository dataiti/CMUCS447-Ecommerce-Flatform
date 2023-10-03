import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getListCategoriesApi } from "../../../apis/category";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Swal from "sweetalert2";

import Button from "../../../components/Button";
import Field from "../../../components/Field";
import Label from "../../../components/Label";
import Loading from "../../../components/Loading";
import Quill from "../../../components/Quill";
import { icons } from "../../../utils/icons";
import { addProductThunkAction } from "../../../redux/features/productSlice";
import { setTitleHeader } from "../../../redux/features/titleSlice";
import { authSelect } from "../../../redux/features/authSlice";

const addProductSchema = yup.object({
  name: yup.string().required("Bắt buộc, không được để trống !"),
  description: yup.string().required("Bắt buộc !"),
  images: yup.string().required("Bắt buộc, không được để trống  !"),
  price: yup
    .number()
    .typeError("Phải là giá trị số")
    .required("Bắt buộc, không được để trống  !")
    .min(1000, "Phải lớn hơn 1000đ"),
  promotinalPrice: yup.number().required("Bắt buộc !"),
});

const AddProduct = () => {
  const [listCategories, setListCategories] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [colorCount, setColorCount] = useState(1);
  const [sizeCount, setSizeCount] = useState(1);
  const [content, setContent] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [typeClassify, setTypeClassify] = useState("basic");

  const { id } = useParams();

  const dispatch = useDispatch();
  const { userInfo } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: "",
      images: [],
      price: "",
      quantity: 0,
    },
    // resolver: yupResolver(addProductSchema),
  });

  useEffect(() => {
    dispatch(setTitleHeader("Thêm sản phẩm"));
  }, [dispatch]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getListCategoriesApi();
        if (res && res.data) {
          setListCategories(res.data);
        }
      } catch (error) {}
    };
    fetchApi();
  }, []);

  const handleSubmitAddProduct = async (values) => {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("categoryId", values.categoryId);
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      formData.append("description", content);
      formData.append("storeId", id);
      formData.append("price", values.price);
      if (values.quantity) {
        formData.append("quanity", values.quantity);
      }
      if (values.colors) {
        formData.append("optionStyles", JSON.stringify(values.colors));
      }
      const res = await dispatch(
        addProductThunkAction({ storeId: id, userId: userInfo?._id, formData })
      );
      if (res && res.payload && res.payload.success) {
        Swal.fire({
          title: "Success",
          text: "Successfully added new products",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
      setPreviewUrls([]);
      setColorCount(1);
      setSizeCount(4);
      setContent("");
      reset();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  const createColorFields = () => {
    const fields = [];
    for (let i = 0; i < colorCount; i++) {
      fields.push(
        <div
          key={i}
          className="grid grid-cols-3 border border-gray-300 rounded-sm p-3 my-2 overflow-hidden"
        >
          <div className="col-span-1 flex gap-1 justify-center items-center mr-5">
            <Label
              htmlFor={`colors[${i}].name`}
              label="Tên phân loại"
              className="ml-0 text-xs"
            />
            <Controller
              name={`colors[${i}].name`}
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  className="border border-gray-300 rounded-sm w-[100%] outline-none px-2 py-1 text-sm placeholder:text-xs"
                  placeholder="Nhập vào"
                />
              )}
            />
          </div>

          <div className="col-span-2 flex flex-col ">{createSizeFields(i)}</div>
        </div>
      );
    }
    return fields;
  };

  const createSizeFields = (colorIndex) => {
    const fields = [];
    for (let i = 0; i < sizeCount; i++) {
      fields.push(
        <div key={i} className="grid grid-cols-3 mb-2">
          <div className="col-span-1 flex items-center gap-4">
            <Label
              htmlFor={`colors[${colorIndex}].sizes[${i}].name`}
              label="Tên"
              className="text-xs"
            />
            <Controller
              name={`colors[${colorIndex}].sizes[${i}].name`}
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  className="border border-gray-300 rounded-sm w-20 outline-none px-2 py-1 text-sm placeholder:text-xs"
                  placeholder="Nhập vào"
                />
              )}
            />
          </div>
          <div className="col-span-1 flex items-center gap-4">
            <Label
              htmlFor={`colors[${colorIndex}].sizes[${i}].quantity`}
              label="Kho"
              className="text-xs"
            />
            <Controller
              name={`colors[${colorIndex}].sizes[${i}].quantity`}
              control={control}
              defaultValue={0}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className="border border-gray-300 rounded-sm w-20 outline-none px-2 py-1 text-sm placeholder:text-xs"
                  placeholder="Nhập vào"
                />
              )}
            />
          </div>
          <div className="col-span-1 flex items-center gap-4">
            <Label
              htmlFor={`colors[${colorIndex}].sizes[${i}].price`}
              label="Giá"
              className="text-xs"
            />
            <Controller
              name={`colors[${colorIndex}].sizes[${i}].price`}
              control={control}
              defaultValue={0}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className="border border-gray-300 rounded-sm w-28 outline-none px-2 py-1 text-sm placeholder:text-xs"
                  placeholder="Nhập vào"
                />
              )}
            />
          </div>
        </div>
      );
    }
    return fields;
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-md pb-4 mx-40 my-5 h-[96%] overflow-y-auto">
        {loading && <Loading />}
        <form
          className=" w-full rounded-md bg-white"
          onSubmit={handleSubmit(handleSubmitAddProduct)}
        >
          <div className="flex flex-col gap-5 px-16 py-8">
            <div className="col-span-5 flex flex-col gap-6">
              <h3 className="text-lg text-red-900 font-bold uppercase">
                Thông tin cơ bản
              </h3>
              <div className="flex items-center gap-2">
                <Controller
                  name="images"
                  control={control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <>
                      <label
                        className="text-gray-500 cursor-pointer h-24 w-28 bg-slate-200 rounded-md flex flex-col items-center justify-center"
                        htmlFor="images"
                      >
                        <Label label="Hình ảnh" className="ml-0" />
                        <icons.RiImageAddFill size={40} />
                      </label>
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
                <div className="h-24 w-full flex items-center gap-2 border-2 border-gray-300 p-2 rounded-sm border-dashed overflow-hidden">
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
              <Field
                control={control}
                name="name"
                type="text"
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
                // errors={errors.name}
              />
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <>
                    <Label label="Danh mục sản phẩm" />
                    <select
                      className="outline-none px-2 py-3 text-sm text-gray-900 rounded-md bg-white border border-gray-300 cursor-pointer -mt-5"
                      {...field}
                    >
                      <option defaultValue value="" disabled>
                        Chọn danh mục sản phẩm
                      </option>
                      {listCategories?.length > 0 &&
                        listCategories.map((item) => {
                          return (
                            <option value={item?._id} key={item?._id}>
                              {item?.name}
                            </option>
                          );
                        })}
                    </select>
                  </>
                )}
              />
              <div className="mb-10">
                <Label label="Mô tả sản phẩm" />
                <Quill content={content} setContent={setContent} />
              </div>
            </div>

            <div className="col-span-6 flex flex-col gap-5">
              <h3 className="text-lg text-red-900 uppercase font-bold">
                Phân loại sản phẩm
              </h3>

              <div className="flex items-center gap-4">
                <span
                  className="border-2 py-1 flex px-3 border-dashed text-sm font-bold border-teal-600 text-teal-600 rounded-full cursor-pointer"
                  onClick={() => setTypeClassify("basic")}
                >
                  Thêm sản phẩm không phân loại
                </span>
                <span
                  className="border-2 py-1 flex px-3 border-dashed text-sm font-bold border-teal-600 text-teal-600 rounded-full cursor-pointer"
                  onClick={() => setTypeClassify("advanced")}
                >
                  Thêm sản phẩm với nhiều phân loại
                </span>
              </div>
              {typeClassify === "basic" && (
                <div className="col-span-6 flex flex-col gap-5">
                  <Field
                    control={control}
                    name="price"
                    type="number"
                    label="Giá sản phẩm"
                    placeholder="Nhập giá tiền sản phẩm"
                    // errors={errors.price}
                  />
                  <Field
                    control={control}
                    name="quantity"
                    type="number"
                    label="Số lượng sản phẩm"
                    placeholder="Nhập số lượng sản phẩm"
                    // errors={errors.promotinalPrice}
                  />
                </div>
              )}

              {typeClassify === "advanced" && (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <Label
                        label="Số lượng nhóm phân loại 1"
                        htmlFor="colorCount"
                      />
                      <input
                        name="colorCount"
                        type="text"
                        value={colorCount}
                        onChange={(e) => setColorCount(e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-md outline-none w-full text-sm"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1">
                      <Label
                        label="Số lượng nhóm phân loại 2"
                        htmlFor="sizeCount"
                      />
                      <input
                        name="sizeCount"
                        type="text"
                        value={sizeCount}
                        onChange={(e) => setSizeCount(e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-md outline-none w-full text-sm"
                      />
                    </div>
                  </div>

                  {createColorFields()}
                </>
              )}
            </div>
          </div>
          <Button primary className="mx-auto mt-8">
            Create
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;

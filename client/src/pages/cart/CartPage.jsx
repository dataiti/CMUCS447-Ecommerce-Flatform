import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  cartSelect,
  decrementQuantityCartThunkAction,
  getListCartsByUserThunkAction,
  incrementQuantityCartThunkAction,
  removeCartThunkAction,
  setQuantityCartThunkAction,
} from "../../redux/features/cartSlice";

import { authSelect } from "../../redux/features/authSlice";
import { getTotal, numberWithCommas } from "../../utils/fn";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Label from "../../components/Label";
import { setListProductToCheckout } from "../../redux/features/checkoutSlice";
import { icons } from "../../utils/icons";
import Swal from "sweetalert2";
import { setQuantityCartApi } from "../../apis/cart";

const CartPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkedProduct, setCheckedProduct] = useState([]);
  const [isLoadingQuantity, setIsLoadingQuantity] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listCarts } = useSelector(cartSelect);
  const { token, userInfo } = useSelector(authSelect);

  useEffect(() => {
    const fetchListCarts = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListCartsByUserThunkAction({ userId: userInfo?._id, token })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchListCarts();
  }, [dispatch]);

  useEffect(() => {
    const listProductsCheckout = checkedProduct.map((item) => {
      return JSON.parse(item);
    });

    const result = getTotal(listProductsCheckout);

    if (result) {
      setTotalPrice(result.totalPrice);
      setTotalQuantity(result.totalQuantity);
    }
  }, [checkedProduct]);

  const handleIncrementQuantityCart = async (_id) => {
    try {
      setIsLoadingQuantity(true);
      await dispatch(
        incrementQuantityCartThunkAction({ userId: userInfo?._id, cartId: _id })
      );
      setIsLoadingQuantity(false);
    } catch (error) {
      setIsLoadingQuantity(false);
    }
  };

  const handleDecrementQuantityCart = async (_id) => {
    try {
      setIsLoadingQuantity(true);
      await dispatch(
        decrementQuantityCartThunkAction({ userId: userInfo?._id, cartId: _id })
      );
      setIsLoadingQuantity(false);
    } catch (error) {
      setIsLoadingQuantity(false);
    }
  };

  const handleChangeQuantity = () => {};

  const handleRemoveCart = async (cartId) => {
    try {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể hoàn nguyên điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Đồng ý, xóa nó!",
      }).then(async (result) => {
        setIsLoading(true);
        if (result.isConfirmed) {
          await dispatch(
            removeCartThunkAction({ userId: userInfo?._id, cartId })
          );
          Swal.fire("Đã xóa!", "Đã xóa sản phẩm trong giỏ hàng.", "Thành công");
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDispatchListProductToCheckout = async () => {
    const listProductsCheckout = checkedProduct.map((item) => {
      return JSON.parse(item);
    });
    dispatch(
      setListProductToCheckout({
        listProductsCheckout,
        totalPrice,
        totalQuantity,
      })
    );
    if (listProductsCheckout.length > 0) {
      navigate("/payment");
    }
  };

  const handleSetQuantityCart = async ({ cartId }) => {
    try {
      setIsLoading(true);
      await dispatch(
        setQuantityCartThunkAction({
          userId: userInfo?._id,
          cartId,
          data: { newQuantity: quantity },
        })
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between pr-10">
        <h4 className="uppercase font-extrabold text-lg text-emerald-700">
          Giỏ Hàng
        </h4>
        <div className="relative h-[6px] w-[70%] bg-gray-300 rounded-full">
          <div className="absolute -top-[7px] left-[-30px] flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
              Giỏ Hàng
            </span>
          </div>
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-gray-500"></p>
            <span className="font-semibold text-gray-500 text-sm">
              Thanh Toán
            </span>
          </div>
          <div className="absolute -top-[7px] -right-[35px] flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-gray-500"></p>
            <span className="font-semibold text-gray-500 text-sm">
              Chờ Xác Nhận
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[510px] grid grid-cols-11 gap-2 ">
        {isLoading && <Loading />}
        <div className="col-span-8 border rounded-md overflow-hidden bg-white shadow-md">
          <div className="grid grid-cols-8 p-2 text-teal-700 font-bold text-center bg-white">
            <span className="col-span-1/2">CHỌN</span>
            <span className="col-span-2">SẢN PHẨM</span>
            <span>ĐƠN GIÁ</span>
            <span className="col-span-2">SỐ LƯỢNG</span>
            <span>THÀNH TIỀN</span>
            <span>THAO TÁC</span>
          </div>
          <div className="flex flex-col gap-2 p-2 h-[90%] overflow-y-auto">
            {listCarts.length > 0 &&
              listCarts.map((cartItem, index) => {
                return (
                  <div
                    className="grid grid-cols-8 gap-5 bg-slate-200/80 p-2 rounded-md cursor-pointer hover:bg-slate-300/80 transition-all"
                    key={index}
                  >
                    <div className="col-span-1/2 flex items-center justify-center">
                      <Checkbox
                        checked={checkedProduct}
                        setChecked={setCheckedProduct}
                        id={cartItem?._id}
                        name="productCartId"
                        value={JSON.stringify({ ...cartItem })}
                      />
                    </div>
                    <Link
                      to={`/product-detail/${cartItem?.productId?._id}`}
                      className="col-span-2 flex items-center gap-2"
                    >
                      <img
                        src={cartItem?.productId?.imagePreview}
                        alt=""
                        className="w-20 h-20 rounded-sm shadow-md"
                      />
                      <div className="flex flex-col">
                        <p className="name-1 text-teal-600 font-semibold">
                          {cartItem?.productId?.name}
                        </p>
                        <span className="text-sm text-gray-400 italic">
                          {cartItem?.storeId?.name}
                        </span>
                        {cartItem?.optionStyle && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black italic">
                              {cartItem?.optionStyle?.option1} -{" "}
                              {cartItem?.optionStyle?.option2}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center justify-center font-bold ">
                      {numberWithCommas(Number(cartItem?.price))}
                      <span className="ml-2 text-xs"> VND</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <div
                        className={`col-span-3 flex items-center text-lg font-semibold ${
                          isLoadingQuantity && "opacity-50 select-none"
                        }`}
                      >
                        <button
                          className="bg-gray-300 w-8 h-9 text-white rounded-tl-sm rounded-bl-sm"
                          onClick={() =>
                            handleDecrementQuantityCart(cartItem?._id)
                          }
                        >
                          -
                        </button>
                        <Modal
                          nameBtn={cartItem?.quantity}
                          outline={true}
                          classNameBtn="border-none rounded-none w-8 h-8 text-base bg-white"
                        >
                          <div className="bg-opacity border-white border-w rounded-md p-5 flex flex-col gap-2">
                            <Label label="Thay đổi Số lượng" />
                            <input
                              type="number"
                              placeholder="Nhập số lượng muốn thay đổi"
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(Number(e.target.value))
                              }
                              className="text-sm placeholder:text-sm outline-none p-3 rounded-full"
                            />
                            <Button
                              primary
                              onClick={() =>
                                handleSetQuantityCart({ cartId: cartItem?._id })
                              }
                            >
                              Thay đổi
                            </Button>
                          </div>
                        </Modal>
                        <button
                          className="bg-gray-300 w-8 h-9 text-white rounded-tr-sm rounded-br-sm"
                          onClick={() =>
                            handleIncrementQuantityCart(cartItem?._id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center font-bold ">
                      {numberWithCommas(cartItem?.price * cartItem?.quantity)}
                      <span className="ml-2 text-xs"> VND</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-gray-300 px-4 py-1 rounded-md text-gray-500"
                        onClick={() => handleRemoveCart(cartItem?._id)}
                      >
                        <icons.MdDeleteForever size={26} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-span-3 border rounded-md overflow-hidden bg-white">
          <div className="p-2 py-4 flex flex-col gap-4 font-bold text-center text-teal-700">
            <h4 className="uppercase">Tổng tiền giỏ hàng</h4>
            <div className="flex flex-col gap-3 bg-slate-200/80 p-2 rounded-md">
              <div className="grid grid-cols-2 py-3 rounded-md">
                <span className="text-start">Tổng sản phẩm</span>
                <span className="text-end text-2xl font-bold text-yellow-600">
                  x {totalQuantity}
                </span>
              </div>
              <div className="grid grid-cols-3 py-3 rounded-md">
                <span className="text-start">Tổng tiền</span>
                <span className="col-span-2 text-end text-xl font-bold text-yellow-600">
                  x {numberWithCommas(totalPrice)}{" "}
                  <span className="text-sm">VND</span>
                </span>
              </div>
            </div>
            <Button
              primary
              className="w-full"
              onClick={handleDispatchListProductToCheckout}
            >
              Thanh Toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { icons } from "../../utils/icons";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { authSelect } from "../../redux/features/authSlice";
import { checkoutSelect } from "../../redux/features/checkoutSlice";
import { convertVNDtoUSD, numberWithCommas } from "../../utils/fn";
import { getAddressDefaultApi } from "../../apis/address";
import Modal from "../../components/Modal";
import AddressPage from "../profile/AddressPage";
import { addressSelect } from "../../redux/features/addressSlice";
import { getListDeliveriesByUserApi } from "../../apis/delivery";
import { createOrderApi } from "../../apis/order";
import { senMailOTPApi } from "../../apis/mail";
import { removeCartThunkAction } from "../../redux/features/cartSlice";
import MapboxMap from "../../components/MapboxMap";
import MapContainer from "../../components/MapContainer";

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addressDefault, setAddressDefault] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [listDeliveriesUnit, setListDeliveriesUnit] = useState([]);
  const [deliveryUnitDefault, setDeliveryUnitDefault] = useState("");
  const [OTPFromMail, setOTPFromMail] = useState("");
  const [OTPValue, setOTPValue] = useState("");
  const [isOTPValid, setIsOTPValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, userInfo } = useSelector(authSelect);
  const { addressDefaultId } = useSelector(addressSelect);
  const { listProductsCheckout, totalPrice, totalQuantity } =
    useSelector(checkoutSelect);

  useEffect(() => {
    const fetchAddressDefaultApi = async () => {
      if (userInfo) {
        const res = await getAddressDefaultApi({
          userId: userInfo?._id,
        });
        if (res && res.data) {
          setAddressDefault(res.data);
        }
      }
    };
    fetchAddressDefaultApi();
  }, [addressDefaultId]);

  useEffect(() => {
    const fetchDeliveryUnitApi = async () => {
      const res = await getListDeliveriesByUserApi();
      if (res && res.data) {
        setListDeliveriesUnit(res.data);
        setDeliveryUnitDefault(res.data[0]);
      }
    };
    fetchDeliveryUnitApi();
  }, []);

  useEffect(() => {
    if (!OTPFromMail || !OTPValue || OTPFromMail !== OTPValue) {
      setIsOTPValid(false);
    } else if (OTPFromMail === OTPValue) {
      setIsOTPValid(true);
    } else {
      setIsOTPValid(false);
    }
  }, [OTPFromMail, OTPValue]);

  const handlePayPalApprove = (data, actions) => {
    try {
      return actions.order.capture().then(async function (details) {
        console.log("details asdasda", details);
        if (
          !addressDefault._id ||
          !deliveryUnitDefault._id ||
          !paymentMethod ||
          !deliveryUnitDefault?.price?.$numberDecimal ||
          listProductsCheckout.forEach((product) => {
            if (
              !product.productId ||
              !product.quantity ||
              !product.price ||
              !product.storeId._id ||
              !product.optionStyle ||
              !userInfo._id
            ) {
              return false;
            }
            return true;
          })
        ) {
          return;
        }
        let dataOrder = [];
        listProductsCheckout.forEach((product) => {
          let object = {};
          object.deliveryId = deliveryUnitDefault._id;
          object.shippingAddressId = addressDefault._id;
          object.paymentMethod = paymentMethod;
          object.shippingPrice = Number(
            deliveryUnitDefault?.price?.$numberDecimal
          );
          object.productId = product?.productId;
          object.quantity = Number(product?.quantity);
          object.province = addressDefault?.province;
          object.categoryId = product?.productId?.categoryId;
          object.totalPrice =
            Number(product?.price) * Number(product?.quantity) +
            Number(deliveryUnitDefault?.price?.$numberDecimal);
          object.optionStyle = product?.optionStyle ? product?.optionStyle : {};
          object.storeId = product?.storeId?._id;
          dataOrder.push(object);
        });
        setIsLoading(true);
        const res = await createOrderApi({
          userId: userInfo?._id,
          data: { carts: JSON.stringify(dataOrder) },
        });
        if (res && res.success) {
          listProductsCheckout.forEach(async (product) => {
            await dispatch(
              removeCartThunkAction({
                userId: userInfo?._id,
                cartId: product._id,
              })
            );
          });
          setIsLoading(false);
          toast.success("Đặt hàng thành công. !");
          navigate("/payment-success");
        }
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlePayPalCreateOrder = (data, actions) => {
    if (
      totalQuantity > 50 ||
      totalPrice + Number(deliveryUnitDefault?.price?.$numberDecimal) > 10000000
    ) {
      if (!OTPFromMail && OTPFromMail !== OTPValue) {
        setIsOTPValid(false);
        return;
      }
    }
    setIsOTPValid(true);

    if (
      !addressDefault._id ||
      !deliveryUnitDefault._id ||
      !paymentMethod ||
      !deliveryUnitDefault?.price?.$numberDecimal ||
      listProductsCheckout.forEach((product) => {
        if (
          !product.productId ||
          !product.quantity ||
          !product.price ||
          !product.storeId._id ||
          !product.optionStyle ||
          !userInfo._id
        ) {
          return false;
        }
        return true;
      })
    ) {
      return;
    } else
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: `${convertVNDtoUSD(
                Number(totalPrice) +
                  Number(deliveryUnitDefault?.price?.$numberDecimal)
              )}`,
            },
          },
        ],
      });
  };

  const handleSendOTPMail = async () => {
    try {
      setIsLoading(true);
      const res = await senMailOTPApi({ data: { email: userInfo?.email } });
      if (res && res.data) {
        setOTPFromMail(res.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      if (
        totalQuantity > 50 ||
        totalPrice + Number(deliveryUnitDefault?.price?.$numberDecimal) >
          10000000
      ) {
        if (!OTPFromMail || !OTPValue || OTPFromMail !== OTPValue) {
          setIsOTPValid(false);
          return;
        }
      }

      setIsOTPValid(true);
      if (
        !addressDefault._id ||
        !deliveryUnitDefault._id ||
        !paymentMethod ||
        !deliveryUnitDefault?.price?.$numberDecimal ||
        listProductsCheckout.forEach((product) => {
          if (
            !product.productId ||
            !product.quantity ||
            !product.price ||
            !product.storeId._id ||
            !product.optionStyle ||
            !userInfo._id
          ) {
            return false;
          }
          return true;
        })
      ) {
        return;
      }
      let dataOrder = [];
      listProductsCheckout.forEach((product) => {
        let object = {};
        object.deliveryId = deliveryUnitDefault._id;
        object.shippingAddressId = addressDefault._id;
        object.paymentMethod = paymentMethod;
        object.shippingPrice = Number(
          deliveryUnitDefault?.price?.$numberDecimal
        );
        object.productId = product?.productId;
        object.province = addressDefault?.province;
        object.categoryId = product?.productId?.categoryId;
        object.quantity = Number(product?.quantity);
        object.totalPrice =
          Number(product?.price) * Number(product?.quantity) +
          Number(deliveryUnitDefault?.price?.$numberDecimal);
        object.optionStyle = product?.optionStyle ? product?.optionStyle : {};
        object.storeId = product?.storeId?._id;
        dataOrder.push(object);
      });
      setIsLoading(true);
      const res = await createOrderApi({
        userId: userInfo?._id,
        data: {
          carts: JSON.stringify(dataOrder),
        },
        token: token,
      });
      if (res && res.success) {
        listProductsCheckout.forEach(async (product) => {
          await dispatch(
            removeCartThunkAction({
              userId: userInfo?._id,
              cartId: product._id,
            })
          );
        });
        toast.success("Đặt hàng thành công. !");
        navigate("/payment-success");
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {isLoading && <Loading />}
      <div className="flex items-center justify-between pr-10">
        <h4 className="uppercase font-extrabold text-lg text-emerald-700">
          Thanh Toán
        </h4>
        <div className="relative h-[6px] w-[70%] bg-gray-300 rounded-full">
          <div className="absolute -top-[7px] left-[-30px] flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
              Giỏ Hàng
            </span>
          </div>
          <p className="h-[6px] w-[50%] bg-teal-600 rounded-full"></p>
          <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <p className="h-5 w-5 rounded-full bg-teal-600"></p>
            <span className="font-semibold text-teal-600 text-sm">
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
      <div className="w-full grid grid-cols-11 gap-2">
        <div className="col-span-8 flex flex-col gap-2">
          <div className="flex flex-col bg-white rounded-sm overflow-hidden border shadow-sm">
            <div className=" flex items-center gap-4 py-2 px-4 bg-slate-200 ">
              <span className="text-red-500">
                <icons.IoLocationSharp size={30} />
              </span>
              <h4 className="text-base border-b text-teal-700 uppercase font-bold">
                Địa Chỉ Nhận Hàng
              </h4>
            </div>
            <div className="grid grid-cols-10">
              <div className="col-span-8 p-4">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-cyan-700">
                      Tên:
                    </span>
                    <p className="text-gray-500 font-semibold text-sm">
                      {addressDefault?.displayName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-cyan-700">
                      Số điện thoại:
                    </span>
                    <p className="text-gray-500 font-semibold text-sm">
                      {addressDefault?.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <span className="col-span-1 text-sm font-bold text-cyan-700">
                    Địa chỉ chính xác:
                  </span>
                  <p className="col-span-4 text-gray-500 font-semibold text-sm">
                    {addressDefault?.exactAddress} - {addressDefault?.district}{" "}
                    - {addressDefault?.ward} - {addressDefault?.province}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <Modal
                  nameBtn="Thay đổi"
                  outline={true}
                  classNameBtn="px-2 rounded-full"
                >
                  <AddressPage />
                </Modal>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <MapboxMap address={addressDefault} setIsLoading={setIsLoading} />
            {/* <MapContainer address={addressDefault} /> */}
          </div>
          <div className="shadow-sm rounded-sm overflow-hidden border bg-white">
            <table className="w-full text-sm text-left text-gray-400 cursor-pointer">
              <thead className="text-xs border-b text-teal-700 uppercase bg-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hình ảnh
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Giá tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              {isLoading ? (
                <Loading />
              ) : (
                <tbody>
                  {listProductsCheckout?.length > 0 &&
                    listProductsCheckout.map((product, index) => {
                      return (
                        <tr
                          className="bg-white border-b hover:bg-gray-100 "
                          key={product?._id || index}
                        >
                          <td className="px-6 py-6 text-sm text-gray-500">
                            ... {product?.productId?._id.slice(-4)}
                          </td>

                          <td className="px-3 py-3 text-sm text-gray-500">
                            <div className="col-span-2 flex items-center gap-2">
                              <img
                                src={product?.productId?.imagePreview}
                                alt=""
                                className="w-20 h-20 rounded-sm shadow-md"
                              />
                              <div className="flex flex-col">
                                <p className="name-1 text-teal-600 font-semibold">
                                  {product?.productId?.name.slice(0, 20)} ...
                                </p>
                                <span className="text-sm text-gray-400 italic">
                                  {product?.storeId?.name}
                                </span>
                                {product?.optionStyle && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 italic">
                                      {product?.optionStyle?.option1} -{" "}
                                      {product?.optionStyle?.option2}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-500">
                            <div className="flex items-center justify-center  text-lg font-bold text-yellow-600">
                              {numberWithCommas(product?.price)}
                              <span className="ml-2 text-sm text-black">
                                {" "}
                                VND
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6 ">
                            <span className="text-lg font-bold text-gray-500 flex items-center justify-center">
                              {product?.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-500">
                            <div className="flex items-center justify-center  text-lg font-bold text-yellow-600">
                              {numberWithCommas(
                                product?.price * product?.quantity
                              )}
                              <span className="ml-2 text-sm text-black">
                                {" "}
                                VND
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              )}
            </table>
            <div>
              <div className="flex items-center justify-between gap-4 bg-gray-200 p-4 text-slate-800 font-bold">
                <div className="flex flex-col gap-2">
                  <div className=" flex items-center gap-4 bg-slate-200 ">
                    <span className="text-red-500">
                      <icons.FaShippingFast size={30} />
                    </span>
                    <h4 className="text-base border-b text-teal-700 uppercase font-bold">
                      Phương thức Vận chuyển
                    </h4>
                  </div>
                  {deliveryUnitDefault && (
                    <div className="flex items-center gap-3">
                      <img
                        src={deliveryUnitDefault.logo}
                        alt=""
                        className="h-14 w-14 rounded-md border object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p>{deliveryUnitDefault.name}</p>
                        <div className="flex items-center">
                          <span className="text-gray-400 text-sm">
                            Phí vận chuyển:
                          </span>
                          <span className="text-lg text-teal-700 ml-3">
                            {numberWithCommas(
                              deliveryUnitDefault?.price?.$numberDecimal
                            )}
                          </span>{" "}
                          <span className="text-xs">VND</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  Tổng số tiền ({totalQuantity} sản phẩm):{" "}
                  <span className="text-3xl text-teal-700">
                    {numberWithCommas(totalPrice)}
                  </span>
                  VND
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col bg-white rounded-sm overflow-hidden border shadow-sm">
          <div className=" flex items-center gap-4 py-2 px-4 bg-slate-200 ">
            <span className="text-red-500">
              <icons.FaShippingFast size={30} />
            </span>
            <h4 className="text-base border-b text-teal-700 uppercase font-bold">
              Phương thức thanh toán
            </h4>
          </div>
          <div className="flex flex-col gap-4 p-2">
            <div className="col-span-3 flex flex-col gap-2">
              <button
                className={`outline-none px-4 py-3 text-sm font-bold text-gray-500 ${
                  paymentMethod === "COD"
                    ? "border-l-4 border-green-500 bg-green-100/70"
                    : "bg-slate-100"
                }`}
                onClick={() => setPaymentMethod("COD")}
              >
                Thanh toán khi nhận hàng
              </button>
              <button
                className={` outline-none px-4 py-3 text-sm font-bold text-gray-500 ${
                  paymentMethod === "PayPal"
                    ? "border-l-4 border-green-500 bg-green-100/70"
                    : "bg-slate-100"
                }`}
                onClick={() => setPaymentMethod("PayPal")}
              >
                Thanh toán bằng PayPal
              </button>
            </div>
            <div className="col-span-3 border rounded-md overflow-hidden">
              {paymentMethod === "COD" ? (
                <div className="flex flex-col bg-slate-200/80 p-2 rounded-md">
                  <div className="grid grid-cols-2 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng sản phẩm
                    </span>
                    <span className="text-end text-lg font-bold text-yellow-600">
                      {totalQuantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Phí vận chuyển
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {deliveryUnitDefault?.price?.$numberDecimal &&
                        numberWithCommas(
                          deliveryUnitDefault?.price?.$numberDecimal
                        )}
                      <span className="ml-2 text-sm text-black"> VND</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng tiền
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {numberWithCommas(Number(totalPrice))}{" "}
                      <span className="ml-2 text-sm text-black"> VND</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng thanh toán
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {" "}
                      {numberWithCommas(
                        Number(totalPrice) +
                          Number(deliveryUnitDefault?.price?.$numberDecimal)
                      )}{" "}
                      <span className="ml-2 text-sm text-black"> VND</span>
                    </span>
                  </div>
                  {(totalPrice +
                    Number(deliveryUnitDefault?.price?.$numberDecimal) >
                    10000000 ||
                    totalQuantity > 50) && (
                    <div className="flex flex-col mx-auto gap-2 my-2">
                      {isOTPValid ? (
                        <span className="text-xs text-green-500 font-semibold">
                          Mã OTP hợp lệ. Đặt hàng ngay!
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold">
                          Bạn đã đặt số lượng hoặc số tiền lớn, hãy nhập mã OTP
                          từ email của bạn để tiếp tục đặt hàng
                        </span>
                      )}
                      <div className="bg-white p-2 rounded-sm flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="Nhập mã OTP"
                          className="outline-none"
                          value={OTPValue}
                          onChange={(e) => setOTPValue(e.target.value)}
                        />
                        <button
                          className="text-xs outline-none font-bold text-white rounded-sm bg-slate-700 px-2 py-1"
                          onClick={handleSendOTPMail}
                        >
                          Gửi mail
                        </button>
                      </div>
                    </div>
                  )}
                  <Button
                    primary
                    className="w-full"
                    onClick={handleCreateOrder}
                  >
                    Đặt Hàng
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col bg-slate-200/80 p-2 rounded-md">
                  <div className="grid grid-cols-2 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng sản phẩm
                    </span>
                    <span className="text-end text-lg font-bold text-yellow-600">
                      {totalQuantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Phí vận chuyển
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {" "}
                      {numberWithCommas(
                        convertVNDtoUSD(
                          deliveryUnitDefault?.price?.$numberDecimal
                        )
                      )}
                      <span className="ml-2 text-sm text-black"> $</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng tiền
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {numberWithCommas(convertVNDtoUSD(Number(totalPrice)))}
                      <span className="ml-2 text-sm text-black"> $</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-3 rounded-md">
                    <span className="text-start text-[12px] font-bold text-gray-500">
                      Tổng thanh toán
                    </span>
                    <span className="col-span-2 text-end text-lg font-bold text-yellow-600">
                      {numberWithCommas(
                        convertVNDtoUSD(
                          Number(totalPrice) +
                            Number(deliveryUnitDefault?.price?.$numberDecimal)
                        )
                      )}
                      <span className="ml-2 text-sm text-black"> $</span>
                    </span>
                  </div>
                  {(totalPrice +
                    Number(deliveryUnitDefault?.price?.$numberDecimal) >
                    10000000 ||
                    totalQuantity > 50) && (
                    <div className="flex flex-col mx-auto gap-2 my-2">
                      {isOTPValid ? (
                        <span className="text-xs text-green-500 font-semibold">
                          Mã OTP hợp lệ. Đặt hàng ngay!
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold">
                          Bạn đã đặt số lượng hoặc số tiền lớn, hãy nhập mã OTP
                          từ email của bạn để tiếp tục đặt hàng
                        </span>
                      )}
                      <div className="bg-white p-2 rounded-sm flex items-center justify-between">
                        <input
                          type="text"
                          placeholder="Nhập mã OTP"
                          className="outline-none"
                          value={OTPValue}
                          onChange={(e) => setOTPValue(e.target.value)}
                        />
                        <button
                          className="text-xs outline-none font-bold text-white rounded-sm bg-slate-700 px-2 py-1"
                          onClick={handleSendOTPMail}
                        >
                          Gửi mail
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="col-span-4 relative z-10">
                    <PayPalButton
                      createOrder={(data, actions) =>
                        handlePayPalCreateOrder(data, actions)
                      }
                      onApprove={(data, actions) =>
                        handlePayPalApprove(data, actions)
                      }
                      commit={true}
                      options={{
                        clientId: process.env.REACT_APP_PAYPAL_ID,
                        currency: "USD",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

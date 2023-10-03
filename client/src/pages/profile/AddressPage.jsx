import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../redux/features/authSlice";
import AddAddress from "../../components/AddAddress";
import Modal from "../../components/Modal";
import { icons } from "../../utils/icons";
import {
  addressSelect,
  getListAdressesByUserThunkAction,
  setupDefaultAddressThunkAction,
} from "../../redux/features/addressSlice";
import Button from "../../components/Button";

const AddressPage = () => {
  const [loading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector(authSelect);
  const { listAddresses, addressDefaultId } = useSelector(addressSelect);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getListAdressesByUserThunkAction({ userId: userInfo?._id })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchApi();
  }, [userInfo]);

  const handleSetDefaultAddress = async ({ addressId }) => {
    try {
      setIsLoading(true);
      await dispatch(
        setupDefaultAddressThunkAction({
          userId: userInfo?._id,
          addressId,
        })
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async () => {};

  const handleUpdateAddress = async () => {};

  return (
    <div className="w-full bg-white px-10 py-3 rounded-md shadow-md h-[455px]">
      {loading && <Loading />}
      <div className="grid grid-cols-5 py-3">
        <h3 className="col-span-4 text-center text-xl font-bold border-b-2 border-primary-300">
          Địa chỉ của tôi
        </h3>
        <div className="flex items-center ml-auto">
          <Modal nameBtn="Thêm Địa Chỉ" primary={true} classNameBtn="px-2">
            <AddAddress />
          </Modal>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-2 bg-white max-h-80 min-h-80 overflow-y-auto ">
        {listAddresses?.length > 0 ? (
          listAddresses.map((address) => {
            return (
              <div key={address?._id}>
                <div
                  className={`${
                    addressDefaultId === address?._id &&
                    "border-l-4 border-sky-500"
                  } bg-slate-200/80 p-6`}
                >
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-cyan-700">
                        Tên:
                      </span>
                      <p className="text-gray-500 font-semibold">
                        {address?.displayName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-cyan-700">
                        Số điện thoại:
                      </span>
                      <p className="text-gray-500 font-semibold">
                        {address?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <span className="col-span-1 text-sm font-bold text-cyan-700">
                      Địa chỉ chính xác:
                    </span>
                    <p className="col-span-4 text-gray-500 font-semibold">
                      {address?.exactAddress} - {address?.district} -{" "}
                      {address?.ward} - {address?.province}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      outline
                      className="rounded-full px-4 border-none bg-gray-300 hover:bg-gray-400 font-semibold"
                      onClick={() =>
                        handleSetDefaultAddress({ addressId: address?._id })
                      }
                    >
                      Đặt mặc định
                    </Button>
                    <Button
                      outline
                      className="rounded-full border-none bg-gray-300 hover:bg-gray-400 font-semibold"
                    >
                      Xóa
                    </Button>
                    <Button
                      outline
                      className="rounded-full border-none bg-gray-300 hover:bg-gray-400 font-semibold"
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full bg-red-100/60 p-7 rounded-md flex flex-col gap-2 items-center justify-center">
            <span className="text-gray-500">
              <icons.MdOutlineDoNotDisturbAlt size={50} />
            </span>
            <p className="text-gray-600 font-bold">Bạn chưa có địa chỉ nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;

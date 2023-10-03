import React, { memo, useEffect, useState } from "react";
import { getgetOtherProductOfStoreApi } from "../apis/product";
import Label from "./Label";
import ProductCardRow from "./ProductCardRow";

const OtherProductStore = ({ setIsLoading, storeId = "" }) => {
  const [listOtherProductOfStore, setListOtherProductOfStore] = useState([]);

  useEffect(() => {
    const fetchProductDetailApi = async () => {
      try {
        setIsLoading(true);
        const res = await getgetOtherProductOfStoreApi({
          storeId,
        });
        if (res && res.data) {
          if (res && res.data) {
            setListOtherProductOfStore(res.data);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchProductDetailApi();
  }, [storeId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label label="Các sản phẩm khác của Shop" />
        <button className="text-gray-500 text-sm">Xem tất cả</button>
      </div>
      <div className="p-1 bg-slate-200 flex flex-col gap-1 rounded-sm h-[188px] overflow-y-auto">
        {listOtherProductOfStore?.length > 0 &&
          listOtherProductOfStore.map((item) => {
            return <ProductCardRow productInfo={item} key={item._id} />;
          })}
      </div>
    </div>
  );
};

export default memo(OtherProductStore);

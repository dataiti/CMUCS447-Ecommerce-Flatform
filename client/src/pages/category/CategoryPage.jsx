import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getListCategoriesApi } from "../../apis/category";
import FilterBar from "../../components/FilterBar";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import {
  getListProductsByUserThunkAction,
  productSelect,
} from "../../redux/features/productSlice";
import { optionSortProductItem } from "../../utils/constant";

const CategoryPage = () => {
  const [listCategories, setListCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("_id");
  const [limit, setLimit] = useState(16);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [priceChecked, setPriceChecked] = useState("");
  const [ratingChecked, setRatingChecked] = useState("");

  const dispatch = useDispatch();
  const { listMyProducts, totalPage } = useSelector(productSelect);

  useEffect(() => {
    const fetchListCategoriesApi = async () => {
      const res = await getListCategoriesApi();
      if (res && res.data) {
        setListCategories(res.data);
      }
    };
    fetchListCategoriesApi();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loading]);

  useEffect(() => {
    const fetchListProductByUserApi = async () => {
      try {
        setLoading(true);
        const categoriesArr = JSON.stringify(checkedCategories);
        await dispatch(
          getListProductsByUserThunkAction({
            categories: categoriesArr,
            minPrice,
            maxPrice,
            rating,
            sortBy,
            orderBy,
            limit,
            page,
          })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchListProductByUserApi();
  }, [
    dispatch,
    checkedCategories,
    minPrice,
    maxPrice,
    rating,
    ratingChecked,
    priceChecked,
    sortBy,
    orderBy,
    limit,
    page,
  ]);

  const handleChangePriceRangeRadio = (price) => {
    setPriceChecked(price.id);
    setMinPrice(price.minPrice);
    setMaxPrice(price.maxPrice);
  };

  const handleChangeRatingRadio = (rating) => {
    setRatingChecked(rating.id);
    setRating(rating.count);
  };

  const handleDeleteFilterSelected = () => {
    setPriceChecked("");
    setRatingChecked("");
    setCheckedCategories([]);
    setMaxPrice("");
    setMinPrice("");
    setRating("");
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="grid grid-cols-8 gap-9 p-3 bg-white rounded-md my-5 h-[1460px]">
      {loading && <Loading />}
      <div className="col-span-2">
        <FilterBar
          listCategories={listCategories}
          checked={checkedCategories}
          setChecked={setCheckedCategories}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setRating={setRating}
          priceChecked={priceChecked}
          ratingChecked={ratingChecked}
          handleChangeRatingRadio={handleChangeRatingRadio}
          handleChangePriceRangeRadio={handleChangePriceRangeRadio}
          handleDeleteFilterSelected={handleDeleteFilterSelected}
        />
      </div>
      <div className="col-span-6 relative">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-2 rounded-sm mb-5 gap-2 bg-gray-200">
            <div className="w-2/3 flex items-center gap-3">
              <span className="text-sm text-teal-700 font-bold">
                Sắp xếp theo:{" "}
              </span>
              <select
                id="small"
                className="outline-none py-1 px-6 text-sm text-gray-900 rounded-sm bg-white cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option defaultValue value="_id">
                  Mới nhất
                </option>
                {optionSortProductItem.map((option, index) => {
                  return (
                    <option key={option.value || index} value={option.value}>
                      {option.display}
                    </option>
                  );
                })}
              </select>
              <span className="text-sm text-teal-700 font-bold">
                Thứ tự theo:{" "}
              </span>
              <select
                id="small"
                className="outline-none py-1 px-6 text-sm text-gray-900 rounded-sm bg-white  cursor-pointer"
                value={orderBy}
                onChange={() => setOrderBy(orderBy !== "asc" ? "asc" : "desc")}
              >
                <option defaultValue value="asc" className="rounded-sm">
                  Thấp đến Cao
                </option>
                <option value="desc">Cao đến Thấp</option>
              </select>
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-4 gap-3">
              {listMyProducts?.length > 0 &&
                listMyProducts.map((product) => {
                  return (
                    <ProductCard productInfo={product} key={product?._id} />
                  );
                })}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 w-full">
          <Pagination
            totalPage={totalPage}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

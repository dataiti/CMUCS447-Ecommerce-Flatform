import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListProductsByUserApi } from "../../apis/product";

const getListProductsByUserThunkAction = createAsyncThunk(
  "product/getListProductsByUser",
  async (
    { orderBy, sortBy, q, limit, page, categories, rating, minPrice, maxPrice },
    thunkAPI
  ) => {
    try {
      const res = await getListProductsByUserApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        categories,
        rating,
        minPrice,
        maxPrice,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listMyProducts: [],
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const productSlide = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getListProductsByUserThunkAction.fulfilled,
      (state, action) => {
        state.listMyProducts = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getListProductsByUserThunkAction };
export const productSelect = (state) => state.product;
export const {} = productSlide.actions;
export default productSlide.reducer;

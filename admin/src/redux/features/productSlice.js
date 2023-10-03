import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListProductsForAdminApi } from "../../apis/product";

const getListProductsForAdminApiThunkAction = createAsyncThunk(
  "product/getListProductsByStore",
  async (
    {
      orderBy,
      sortBy,
      q,
      limit,
      page,
      categoryId,
      rating,
      minPrice,
      maxPrice,
      status,
      userId,
    },
    thunkAPI
  ) => {
    try {
      const res = await getListProductsForAdminApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        categoryId,
        rating,
        minPrice,
        maxPrice,
        status,
        userId,
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
      getListProductsForAdminApiThunkAction.fulfilled,
      (state, action) => {
        state.listMyProducts = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getListProductsForAdminApiThunkAction };
export const productSelect = (state) => state.product;
export const {} = productSlide.actions;
export default productSlide.reducer;

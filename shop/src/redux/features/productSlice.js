import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProductApi,
  getListProductsByStoreApi,
  removeProductApi,
} from "../../apis/product";

const getListProductsByStoreThunkAction = createAsyncThunk(
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
      storeId,
      userId,
    },
    thunkAPI
  ) => {
    try {
      const res = await getListProductsByStoreApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        categoryId,
        rating,
        minPrice,
        maxPrice,
        storeId,
        userId,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const addProductThunkAction = createAsyncThunk(
  "product/addProduct",
  async ({ storeId, userId, formData }, thunkAPI) => {
    try {
      return await createProductApi({ storeId, userId, formData });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const removeProductThunkAction = createAsyncThunk(
  "product/removeProduct",
  async ({ storeId, userId, productId }, thunkAPI) => {
    try {
      return await removeProductApi({ storeId, userId, productId });
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
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListProductsByStoreThunkAction.fulfilled, (state, action) => {
        state.listMyProducts = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      })
      .addCase(addProductThunkAction.fulfilled, (state, action) => {
        state.listMyProducts.push(action.payload?.data);
      })
      // .addCase(updateCategoryThunkAction.fulfilled, (state, action) => {
      //   state.listMyProducts.find((product, index) => {
      //     if (product._id === action.payload?._id) {
      //       state.listMyProducts[index] = action?.payload;
      //       return true;
      //     }
      //   });
      //   return false;
      // })
      .addCase(removeProductThunkAction.fulfilled, (state, action) => {
        const productId = action.meta.arg.productId;
        const removeCategoryIndex = state.listMyProducts.findIndex(
          (product) => product._id === productId
        );
        if (removeCategoryIndex !== -1) {
          state.listMyProducts.splice(removeCategoryIndex, 1);
        }
      });
  },
});

export {
  addProductThunkAction,
  getListProductsByStoreThunkAction,
  removeProductThunkAction,
};
export const productSelect = (state) => state.product;
export const {} = productSlide.actions;
export default productSlide.reducer;

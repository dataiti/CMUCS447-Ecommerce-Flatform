import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrderStatusByStoreeApi } from "../../apis/order";

const getOrderStatusByStoreThunkAction = createAsyncThunk(
  "order/getOrderStatusByStore",
  async ({ orderBy, sortBy, q, limit, page, status, storeId }, thunkAPI) => {
    try {
      const res = await getOrderStatusByStoreeApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        status,
        storeId,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listOrders: [],
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const ordertSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getOrderStatusByStoreThunkAction.fulfilled,
      (state, action) => {
        state.listOrders = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getOrderStatusByStoreThunkAction };
export const orderSelect = (state) => state.order;
export const {} = ordertSlice.actions;
export default ordertSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrderStatusByUserApi } from "../../apis/order";

const getOrderStatusByUserThunkAction = createAsyncThunk(
  "order/getOrderStatusByUser",
  async ({ orderBy, sortBy, q, limit, page, status, userId }, thunkAPI) => {
    try {
      const res = await getOrderStatusByUserApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
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
      getOrderStatusByUserThunkAction.fulfilled,
      (state, action) => {
        state.listOrders = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getOrderStatusByUserThunkAction };
export const orderSelect = (state) => state.order;
export const {} = ordertSlice.actions;
export default ordertSlice.reducer;

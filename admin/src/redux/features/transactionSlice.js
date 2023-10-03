import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListTransactionForAdminApi } from "../../apis/transaction";

const getListTransactionForAdminThunkAction = createAsyncThunk(
  "transaction/getListTransactionForAdmin",
  async ({ orderBy, sortBy, q, limit, page, userId }, thunkAPI) => {
    try {
      const res = await getListTransactionForAdminApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        userId,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listTransactions: [],
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getListTransactionForAdminThunkAction.fulfilled,
      (state, action) => {
        state.listTransactions = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getListTransactionForAdminThunkAction };
export const transactionSelect = (state) => state.transaction;
export const {} = transactionSlice.actions;
export default transactionSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListStoresForAdminApi } from "../../apis/store";

const getListStoresForAdminThunkAction = createAsyncThunk(
  "store/getListStoresForAdmin",
  async ({ orderBy, sortBy, q, limit, page, status, userId }, thunkAPI) => {
    try {
      const res = await getListStoresForAdminApi({
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
  listStores: [],
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getListStoresForAdminThunkAction.fulfilled,
      (state, action) => {
        state.listStores = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      }
    );
  },
});

export { getListStoresForAdminThunkAction };
export const storeSelect = (state) => state.store;
export const {} = storeSlice.actions;
export default storeSlice.reducer;

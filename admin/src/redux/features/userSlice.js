import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getListUserForAdminApi, getUserApi } from "../../apis/user";

const getListUserForAdminThunkAction = createAsyncThunk(
  "auth/getListUserForAdmin",
  async ({ orderBy, sortBy, q, limit, page, status, userId }, thunkAPI) => {
    try {
      const res = await getListUserForAdminApi({
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

const getUserThunkAction = createAsyncThunk(
  "auth/getCategory",
  async (userId, thunkAPI) => {
    try {
      return await getUserApi(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listCustomers: [],
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const customerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListUserForAdminThunkAction.fulfilled, (state, action) => {
        state.listCustomers = action.payload?.data;
        state.totalPage = action.payload?.totalPage;
        state.currentPage = action.payload?.currentPage;
        state.count = action.payload?.count;
      })
      .addCase(getUserThunkAction.fulfilled, (state, action) => {
        state.category = action.payload?.data;
      });
  },
});

export { getListUserForAdminThunkAction, getUserThunkAction };
export const userSelect = (state) => state.user;
export const {} = customerSlice.actions;
export default customerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileStoreApi } from "../../apis/store";

const getProfileStoreApiThunkAction = createAsyncThunk(
  "store/getProfileStoreApi",
  async ({ userId, storeId }, thunkAPI) => {
    try {
      const res = await getProfileStoreApi({
        userId,
        storeId,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  storeProfile: {},
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getProfileStoreApiThunkAction.fulfilled,
      (state, action) => {
        state.storeProfile = action.payload?.data;
      }
    );
  },
});

export { getProfileStoreApiThunkAction };
export const storeSelect = (state) => state.store;
export const {} = storeSlice.actions;
export default storeSlice.reducer;

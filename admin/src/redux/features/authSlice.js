import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAminApi, logoutApi } from "../../apis/auth";

const loginAminThunkAction = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await loginAminApi(data);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const logoutThunkAction = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await logoutApi();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  userInfo: null,
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAminThunkAction.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.userInfo = action.payload.data;
          state.isLoggedIn = true;
          state.token = action.payload.accessToken;
        } else {
          state.isLoggedIn = false;
          state.userInfo = null;
          state.token = null;
        }
      })
      .addCase(logoutThunkAction.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.token = null;
      });
  },
});

export { loginAminThunkAction, logoutThunkAction };
export const authSelect = (state) => state.auth;
export const {} = authSlice.actions;
export default authSlice.reducer;

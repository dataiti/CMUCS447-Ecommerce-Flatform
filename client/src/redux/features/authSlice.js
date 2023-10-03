import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  logoutApi,
  registerApi,
  socialLoginApi,
} from "../../apis/auth";

const registerAction = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerApi(data);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const loginAction = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginApi(data);
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const socialLoginThunkAction = createAsyncThunk(
  "auth/socialLogin",
  async (data, thunkAPI) => {
    try {
      const res = await socialLoginApi(data);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const logoutAction = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await logoutApi();
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

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
      .addCase(registerAction.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
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
      .addCase(socialLoginThunkAction.fulfilled, (state, action) => {
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
      .addCase(logoutAction.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.token = null;
      });
  },
});

export { registerAction, loginAction, logoutAction, socialLoginThunkAction };
export const authSelect = (state) => state.auth;
export const {} = authSlice.actions;
export default authSlice.reducer;

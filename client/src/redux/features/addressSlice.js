import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListAdressesByUserApi,
  addAddressApi,
  setupDefaultAddressApi,
} from "../../apis/address";

const getListAdressesByUserThunkAction = createAsyncThunk(
  "address/getListAdressesByUser",
  async ({ userId }, thunkAPI) => {
    try {
      const res = await getListAdressesByUserApi({ userId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const addAddressThunkAction = createAsyncThunk(
  "address/addAddress",
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await addAddressApi({ userId, data });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const setupDefaultAddressThunkAction = createAsyncThunk(
  "address/setupDefaultAddress",
  async ({ userId, addressId }, thunkAPI) => {
    try {
      const res = await setupDefaultAddressApi({ userId, addressId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listAddresses: [],
  addressDefaultId: "",
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAdressesByUserThunkAction.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.listAddresses = action.payload.data;
          const addressDefaultId = action.payload.data.find(
            (item) => item.isDefaultAddress
          )._id;
          state.addressDefaultId = addressDefaultId;
        }
      })
      .addCase(addAddressThunkAction.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.listAddresses.push(action.payload.data);
        }
      })
      .addCase(setupDefaultAddressThunkAction.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.addressDefaultId = action.payload.data._id;
        }
      });
  },
});

export {
  getListAdressesByUserThunkAction,
  addAddressThunkAction,
  setupDefaultAddressThunkAction,
};
export const addressSelect = (state) => state.address;
export const {} = addressSlice.actions;
export default addressSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCartApi,
  getListCartsByUserApi,
  decrementQuantityCartApi,
  incrementQuantityCartApi,
  removeCartApi,
  setQuantityCartApi,
} from "../../apis/cart";

const getListCartsByUserThunkAction = createAsyncThunk(
  "cart/getListCartsByUser",
  async ({ userId }, thunkAPI) => {
    try {
      const res = await getListCartsByUserApi({ userId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const addCartThunkAction = createAsyncThunk(
  "cart/addCart",
  async ({ userId, data }, thunkAPI) => {
    try {
      const res = await addCartApi({ userId, data });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const removeCartThunkAction = createAsyncThunk(
  "cart/removeCart",
  async ({ userId, cartId }, thunkAPI) => {
    try {
      const res = await removeCartApi({ userId, cartId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const incrementQuantityCartThunkAction = createAsyncThunk(
  "cart/incrementQuantityCart",
  async ({ userId, cartId }, thunkAPI) => {
    try {
      const res = await incrementQuantityCartApi({ userId, cartId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const decrementQuantityCartThunkAction = createAsyncThunk(
  "cart/decrementQuantityCart",
  async ({ userId, cartId }, thunkAPI) => {
    try {
      const res = await decrementQuantityCartApi({ userId, cartId });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const setQuantityCartThunkAction = createAsyncThunk(
  "cart/setQuantityCart",
  async ({ userId, cartId, data }, thunkAPI) => {
    try {
      const res = await setQuantityCartApi({ userId, cartId, data });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  userId: "",
  listCarts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCartsByUserThunkAction.fulfilled, (state, action) => {
        state.listCarts = action.payload.data;
        state.userId = action.payload.data.userId;
      })
      .addCase(incrementQuantityCartThunkAction.fulfilled, (state, action) => {
        const cartId = action.meta.arg.cartId;
        state.listCarts.find((cartItem, index) => {
          if (cartItem._id === cartId) {
            state.listCarts[index].quantity++;
          }
        });
      })
      .addCase(decrementQuantityCartThunkAction.fulfilled, (state, action) => {
        const cartId = action.meta.arg.cartId;
        state.listCarts.find((cartItem, index) => {
          if (cartItem._id === cartId) {
            state.listCarts[index].quantity--;
          }
        });
      })
      .addCase(setQuantityCartThunkAction.fulfilled, (state, action) => {
        const cartId = action.meta.arg.cartId;
        const newQuantity = action.meta.arg.data.newQuantity;
        state.listCarts.find((cartItem, index) => {
          if (cartItem._id === cartId) {
            state.listCarts[index].quantity = newQuantity;
          }
        });
      })
      .addCase(addCartThunkAction.fulfilled, (state, action) => {
        state.listCarts.push(action.payload.data);
      })
      .addCase(removeCartThunkAction.fulfilled, (state, action) => {
        const cartId = action.meta.arg.cartId;
        const cartIndex = state.listCarts.findIndex(
          (cartItem) => cartItem._id === cartId
        );
        if (cartIndex !== -1) {
          state.listCarts.splice(cartIndex, 1);
        }
      });
  },
});

export {
  getListCartsByUserThunkAction,
  addCartThunkAction,
  removeCartThunkAction,
  incrementQuantityCartThunkAction,
  decrementQuantityCartThunkAction,
  setQuantityCartThunkAction,
};
export const cartSelect = (state) => state.cart;
export const {} = cartSlice.actions;
export default cartSlice.reducer;

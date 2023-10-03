import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listProductsCheckout: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setListProductToCheckout: (state, action) => {
      if (action.payload) {
        state.listProductsCheckout = action.payload.listProductsCheckout;
        state.totalPrice = action.payload.totalPrice;
        state.totalQuantity = action.payload.totalQuantity;
      }
    },
  },
  extraReducers: () => {},
});

export const checkoutSelect = (state) => state.checkout;
export const { setListProductToCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

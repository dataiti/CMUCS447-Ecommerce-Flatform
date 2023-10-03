import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import cartReducer from "./features/cartSlice";
import checkoutReducer from "./features/checkoutSlice";
import addressReducer from "./features/addressSlice";
import orderReducer from "./features/orderSlice";

const commonConfig = {
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const userConfig = {
  ...commonConfig,
  key: "root",
};

const rootReducer = combineReducers({
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  address: addressReducer,
  checkout: persistReducer(userConfig, checkoutReducer),
  auth: persistReducer(userConfig, authReducer),
});

export default rootReducer;

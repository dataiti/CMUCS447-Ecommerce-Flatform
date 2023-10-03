import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import titleReducer from "./features/titleSlice";
import orderReducer from "./features/orderSlice";
import storeReducer from "./features/storeSlice";

const commonConfig = {
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const userConfig = {
  ...commonConfig,
  key: "root",
};

const rootReducer = combineReducers({
  store: storeReducer,
  order: orderReducer,
  title: titleReducer,
  product: productReducer,
  auth: persistReducer(userConfig, authReducer),
});

export default rootReducer;

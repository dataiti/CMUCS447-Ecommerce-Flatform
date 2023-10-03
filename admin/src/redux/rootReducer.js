import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import authReducer from "./features/authSlice";
import categoryReducer from "./features/categorySlice";
import userReducer from "./features/userSlice";
import titleReducer from "./features/titleSlice";
import productReducer from "./features/productSlice";
import orderReducer from "./features/orderSlice";
import storeReducer from "./features/storeSlice";
import transactionReducer from "./features/transactionSlice";

const commonConfig = {
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const userConfig = {
  ...commonConfig,
  key: "root",
};

const rootReducer = combineReducers({
  title: titleReducer,
  user: userReducer,
  product: productReducer,
  order: orderReducer,
  category: categoryReducer,
  store: storeReducer,
  transaction: transactionReducer,
  auth: persistReducer(userConfig, authReducer),
});

export default rootReducer;

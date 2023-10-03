import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfileMyStore from "./pages/myShop/shop/ProfileMyStore";
import ManageShopLayout from "./layouts/ManageShopLayout";
import ListProduct from "./pages/myShop/product/ListProduct";
import AddProduct from "./pages/myShop/product/AddProduct";
import SumaryStore from "./pages/myShop/shop/SumaryStore";
import ListOrder from "./pages/myShop/order/ListOrder";
import DecorationShop from "./pages/myShop/shop/DecorationShop";
import Messenger from "./pages/myShop/shop/Messenger";
import SetupShop from "./pages/myShop/shop/SetupShop";
import CreateShop from "./pages/myShop/shop/CreateShop";
import OrderDetail from "./pages/myShop/order/OrderDetail";
import AnalysisPage from "./pages/myShop/analysis/AnalysisPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop/create-shop" element={<CreateShop />} />
      </Route>

      <Route element={<ManageShopLayout />}>
        <Route path="/shop/dashboard/:id" element={<SumaryStore />} />
        <Route path="/shop/manage/profile/:id" element={<ProfileMyStore />} />
        <Route path="/shop/manage-products/all/:id" element={<ListProduct />} />
        <Route
          path="/shop/manage-orders/detail/:id"
          element={<OrderDetail />}
        />
        <Route path="/shop/manage-orders/all/:id" element={<ListOrder />} />
        <Route path="/shop/manage/add-product/:id" element={<AddProduct />} />
        <Route path="/shop/decoration/:id" element={<DecorationShop />} />
        <Route path="/shop/customer-care/:id" element={<Messenger />} />
        <Route path="/shop/setup/:id" element={<SetupShop />} />
        <Route path="/shop/data-analysis/:id" element={<AnalysisPage />} />
      </Route>
    </Routes>
  );
}

export default App;

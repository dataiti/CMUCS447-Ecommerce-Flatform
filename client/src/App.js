import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import ProfileLayout from "./layouts/ProfileLayout";
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/profile/ChangePasswordPage";
import AddressPage from "./pages/profile/AddressPage";
import CategoriesLayout from "./layouts/CategoriesLayout";
import CategoryPage from "./pages/category/CategoryPage";
import NotFound from "./pages/other/NotFound";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import CartPage from "./pages/cart/CartPage";
import CartLayout from "./layouts/CartLayout";
import PaymentPage from "./pages/payment/PaymentPage";
import ListOrder from "./pages/profile/ListOrder";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import StoreProfilePage from "./pages/store/StoreProfilePage";
import OrderDetail from "./pages/profile/OrderDetail";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" index element={<HomePage />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/profile-store/:id" element={<StoreProfilePage />} />
      </Route>

      <Route element={<CartLayout />}>
        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route element={<CategoriesLayout />}>
        <Route path="/categories" element={<CategoryPage />} />
      </Route>

      <Route element={<ProfileLayout />}>
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route
          path="/profile/change-password"
          element={<ChangePasswordPage />}
        />
        <Route path="/profile/addresses" element={<AddressPage />} />
        <Route path="/profile/list-orders" element={<ListOrder />} />
        <Route path="/profile/order-detail/:id" element={<OrderDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

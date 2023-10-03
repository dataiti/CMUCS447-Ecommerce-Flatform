import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ListCategories from "./pages/admin/category/ListCategories";
import UpdateCategory from "./pages/admin/category/UpdateCategory";
import CreateCategory from "./pages/admin/category/CreateCategory";
import ListCustomer from "./pages/admin/customer/ListCustomer";
import DashBoardView from "./pages/admin/dashboard/DashBoardView";
import { useSelector } from "react-redux";
import { authSelect } from "./redux/features/authSlice";
import ListOrder from "./pages/admin/order/ListOrder";
import ListProduct from "./pages/admin/product/ListProduct";
import ListStore from "./pages/admin/store/ListStore";
import TransactionHistoty from "./pages/transaction/TransactionHistoty";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/" element=<Navigate to="/dashboard" /> />
        <Route path="/dashboard/summary" index element={<DashBoardView />} />

        <Route path="/dashboard/categories" element={<ListCategories />} />
        <Route path="/dashboard/orders" element={<ListOrder />} />
        <Route path="/dashboard/products" element={<ListProduct />} />
        <Route path="/dashboard/stores" element={<ListStore />} />
        <Route
          path="/dashboard/categories/update/:id"
          element={<UpdateCategory />}
        />
        <Route
          path="/dashboard/categories/create"
          element={<CreateCategory />}
        />
        <Route path="/dashboard/customers" element={<ListCustomer />} />
        <Route
          path="/dashboard/transaction-history"
          element={<TransactionHistoty />}
        />
      </Route>
    </Routes>
  );
}

export default App;

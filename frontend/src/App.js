import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
import AddCoupon from "./components/Admin/Coupons/AddCoupon";
import Login from "./components/Users/Forms/Login";
import AddProduct from "./components/Admin/Products/AddProduct";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import OrderPayment from "./components/Users/Products/OrderPayment";
import ManageCategories from "./components/Admin/Categories/ManageCategories";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import CategoryToAdd from "./components/Admin/Categories/CategoryToAdd";
import AddCategory from "./components/Admin/Categories/AddCategory";
import AddBrand from "./components/Admin/Categories/AddBrand";
import AddColor from "./components/Admin/Categories/AddColor";
import AllCategories from "./components/HomePage/AllCategories";
import UpdateCoupon from "./components/Admin/Coupons/UpdateCoupon";
import Product from "./components/Users/Products/Product";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import AddReview from "./components/Users/Reviews/AddReview";
import UpdateCategory from "./components/Admin/Categories/UpdateCategory";
import OrdersList from "./components/Admin/Orders/OrdersList";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import Customers from "./components/Admin/Orders/Customers";
import BrandsList from "./components/Admin/Categories/BrandsList";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AdminRoutes from "./components/AuthRoute/AdminRoutes";
import ThanksForOrdering from "./components/Users/Products/ThanksForOrdering";
import ProductUpdate from "./components/Admin/Products/ProuductUpdate";
import UpdateOrders from "./components/Admin/Orders/UpdateOrders";
import ColorsList from "./components/Admin/Categories/ColorsList";
import SendOtp from "./components/Users/Forms/Otp";
import Wishlist from "./components/Users/Products/Wishlist";
import AddSize from "./components/Admin/Categories/AddSize";
import SizeList from "./components/Admin/Categories/SizeList";
import Chat from "./components/Chat/Chat";
import AddressChangeForm from "./components/Users/Forms/AddressChangeForm";
import ForgotPassword from "./components/Users/Forms/ForgotPassword";
import ResetPassword from "./components/Users/Forms/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      {/* hide navbar if admin */}
      <Routes>
        {/* admin route */}
        <Route
          path="admin"
          element={
            <AdminRoutes>
              <AdminDashboard />
            </AdminRoutes>
          }
        >
          {/* products */}
          <Route
            path=""
            element={
              <AdminRoutes>
                <OrdersList />
              </AdminRoutes>
            }
          />
          <Route
            path="add-product"
            element={
              <AdminRoutes>
                <AddProduct />
              </AdminRoutes>
            }
          />
          <Route
            path="manage-products"
            element={
              <AdminRoutes>
                <ManageStocks />
              </AdminRoutes>
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <AdminRoutes>
                <ProductUpdate />
              </AdminRoutes>
            }
          />
          {/* coupons */}
          <Route
            path="add-coupon"
            element={
              <AdminRoutes>
                <AddCoupon />
              </AdminRoutes>
            }
          />
          <Route path="manage-coupon" element={<ManageCoupons />} />
          <Route
            path="manage-coupon/edit/:code"
            element={
              <AdminRoutes>
                <UpdateCoupon />
              </AdminRoutes>
            }
          />
          {/* Category */}
          <Route
            path="category-to-add"
            element={
              <AdminRoutes>
                <CategoryToAdd />
              </AdminRoutes>
            }
          />
          <Route path="add-category" element={<AddCategory />} />
          <Route
            path="manage-category"
            element={
              <AdminRoutes>
                <ManageCategories />
              </AdminRoutes>
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <AdminRoutes>
                <UpdateCategory />
              </AdminRoutes>
            }
          />
          {/* brand category */}
          <Route
            path="add-brand"
            element={
              <AdminRoutes>
                <AddBrand />
              </AdminRoutes>
            }
          />
          <Route path="all-brands" element={<BrandsList />} />
          {/* color category */}
          <Route
            path="add-color"
            element={
              <AdminRoutes>
                <AddColor />
              </AdminRoutes>
            }
          />
          <Route path="all-colors" element={<ColorsList />} />
          {/* size category */}
          <Route
            path="add-size"
            element={
              <AdminRoutes>
                <AddSize />
              </AdminRoutes>
            }
          />
          <Route path="all-sizes" element={<SizeList />} />
          {/* Orders */}
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route
            path="orders/:id"
            element={
              <AdminRoutes>
                <UpdateOrders />
              </AdminRoutes>
            }
          />
          <Route
            path="customers"
            element={
              <AdminRoutes>
                <Customers />
              </AdminRoutes>
            }
          />
        </Route>
        {/* public links */}
        {/* Products */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/success" element={<ThanksForOrdering />} />
        {/* review */}
        <Route
          path="/add-review/:id"
          element={
            <AuthRoute>
              <AddReview />
            </AuthRoute>
          }
        />

        {/* shopping cart */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route
          path="/order-payment"
          element={
            <AuthRoute>
              <OrderPayment />
            </AuthRoute>
          }
        />
        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <AuthRoute>
              <Wishlist />
            </AuthRoute>
          }
        />

        {/* Support Chat */}
        <Route
          path="/support-chat"
          element={
            <AuthRoute>
              <Chat />
            </AuthRoute>
          }
        />

        {/* users */}
        <Route path="/address" element={<AddressChangeForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/send-otp/:user_id" element={<SendOtp />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:user_id/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/customer-profile"
          element={
            <AuthRoute>
              <CustomerProfile />
            </AuthRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

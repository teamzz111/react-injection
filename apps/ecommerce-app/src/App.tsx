import { useEffect } from "react";
import "./App.css";
import ProductListView from "./presentation/screen/Productlist/ProductList.screen";
import Navbar from "./presentation/shared/Navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useProductStore } from "./stores/useProductStore";
import { useAuthStore } from "./stores/useAuthStore";
import Login from "./presentation/screen/Login/Login.screen";
import NotFound from "./presentation/screen/NotFound/NotFound.screen";
import AdminDashboard from "./presentation/screen/AdminPanel/AdminPanel";
import ProtectedRoute from "./utils/ProtectedRoute";
import CartView from "./presentation/screen/Cart/Cart";
import CheckoutView from "./presentation/screen/Checkout/Checkout";
import UserInvoices from "./presentation/screen/UserInvoice/UserInvoice";

function App() {
  const { initializeProducts } = useProductStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      initializeProducts();
    }
  }, [isAuthenticated, initializeProducts]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 w-full">
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-invoices"
            element={
              <ProtectedRoute requiredRole="client">
                <UserInvoices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProductListView />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

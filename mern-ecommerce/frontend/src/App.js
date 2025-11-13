import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { logout } from "./slices/userSlice";
import { getMe } from "./slices/userSlice";

import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Register from "./components/Register";

const stripePromise = loadStripe("pk_test_your_stripe_publishable_key"); // Replace with your key

function Nav() {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!loading && !user) dispatch(getMe());
  }, [dispatch, loading, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading)
    return <nav className="p-4 bg-blue-500 text-white">Loading...</nav>;

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <div>
        <Link to="/" className="mr-4 hover:underline">
          Home
        </Link>
        <Link to="/cart" className="mr-4 hover:underline">
          Cart
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/success"
          element={
            <div className="p-4">Payment Successful! Redirecting...</div>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <AppContent />
      </Elements>
    </Provider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { SocketProvider } from "./contexts/SocketContext";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Home from "./pages/Home/Home";
import RestaurantList from "./components/restaurants/RestaurantList/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail/RestaurantDetail";
import Checkout from "./pages/Checkout/Checkout";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Profile from "./pages/Profile/Profile";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/restaurant/:id"
                    element={<RestaurantDetail />}
                  />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route
                    path="/track-order/:orderId"
                    element={<TrackOrder />}
                  />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

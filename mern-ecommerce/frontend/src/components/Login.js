import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.message || "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="mt-4 text-center">
          No account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";

const Register = ({ setCurrentView }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => setCurrentView("login"), 2000);
    } catch (err) {
      setMessage("Registration failed - username may already exist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Create Account
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Join us to manage your tasks
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            name="username"
            onChange={onChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            name="password"
            onChange={onChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500">
            Password should be at least 6 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center font-medium ${
            message.includes("successful")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentView("login")}
          className="text-blue-500 hover:text-blue-600 font-semibold transition duration-200"
        >
          Sign in here
        </button>
      </p>
    </div>
  );
};

export default Register;

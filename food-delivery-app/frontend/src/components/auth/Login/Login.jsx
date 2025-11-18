import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // Updated path
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: "An error occurred during login" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-center">
          <div className="cell medium-6 large-4">
            <div className="login-card">
              <h2 className="text-center">Sign In</h2>

              {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "is-invalid-input" : ""}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <span className="form-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "is-invalid-input" : ""}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <span className="form-error">{errors.password}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="button expanded"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="login-links text-center">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Sign up here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

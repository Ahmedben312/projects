import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // Updated path
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        navigate("/");
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: "An error occurred during registration" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-center">
          <div className="cell medium-8 large-6">
            <div className="register-card">
              <h2 className="text-center">Create Account</h2>

              {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid-x grid-margin-x">
                  <div className="cell medium-6">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "is-invalid-input" : ""}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <span className="form-error">{errors.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="cell medium-6">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "is-invalid-input" : ""}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <span className="form-error">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

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

                <div className="grid-x grid-margin-x">
                  <div className="cell medium-6">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "is-invalid-input" : ""}
                        placeholder="Create a password"
                      />
                      {errors.password && (
                        <span className="form-error">{errors.password}</span>
                      )}
                    </div>
                  </div>

                  <div className="cell medium-6">
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={
                          errors.confirmPassword ? "is-invalid-input" : ""
                        }
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <span className="form-error">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button expanded"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="register-links text-center">
                <p>
                  Already have an account? <Link to="/login">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

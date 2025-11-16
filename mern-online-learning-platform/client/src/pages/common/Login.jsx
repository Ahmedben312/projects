import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // For demo purposes - remove when server is ready
    if (
      formData.email === "demo@test.com" &&
      formData.password === "password"
    ) {
      const mockUser = {
        id: "1",
        name: "Demo User",
        email: "demo@test.com",
        role: "student",
      };
      localStorage.setItem("token", "demo-token");
      // We'll handle this differently since we're using AuthContext
      // The AuthContext will handle setting the user
      setTimeout(() => {
        window.location.href = "/student/dashboard";
      }, 1000);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/student/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Login to Your Account
        </h2>

        {error && <div className="error-message">{error}</div>}

        <div
          style={{
            background: "#e7f3ff",
            padding: "1rem",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Email: demo@test.com
          <br />
          Password: password
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

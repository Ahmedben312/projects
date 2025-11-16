import React from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>My Profile</h1>
        <div className="card" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#007bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
                marginRight: "1rem",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user?.name}</h2>
              <p style={{ color: "#666", margin: 0 }}>{user?.email}</p>
              <span
                style={{
                  background:
                    user?.role === "instructor" ? "#28a745" : "#007bff",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  display: "inline-block",
                }}
              >
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Account Type</label>
                <p>{user?.role === "instructor" ? "Instructor" : "Student"}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Learning Statistics</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Courses Enrolled</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Courses Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Certificates</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0h</div>
                <div className="stat-label">Learning Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

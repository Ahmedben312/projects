import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import EmptyState from "../../components/common/EmptyState";

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      const response = await API.get("/progress/my-courses");
      setEnrollments(response.data.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (enrollmentId) => {
    try {
      const response = await API.post(
        "/certificates/generate",
        { enrollmentId },
        {
          responseType: "blob",
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${enrollmentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your enrollments...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>My Enrollments</h1>

      {enrollments.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          message="Start your learning journey by enrolling in courses that interest you."
          actionText="Browse Courses"
          actionLink="/"
          showAction={true}
        />
      ) : (
        <div className="enrollments-list">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="enrollment-card">
              <img
                src={enrollment.course.thumbnail}
                alt={enrollment.course.title}
                className="enrollment-thumbnail"
              />
              <div className="enrollment-content">
                <div className="enrollment-info">
                  <h3>{enrollment.course.title}</h3>
                  <p className="instructor">
                    By {enrollment.course.instructor?.name}
                  </p>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Progress: {enrollment.progress}%</span>
                      <span>
                        Time spent:{" "}
                        {Math.floor(enrollment.totalTimeSpent / 3600)}h
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="enrollment-meta">
                    <span>Level: {enrollment.course.level}</span>
                    <span>
                      Last accessed:{" "}
                      {new Date(enrollment.lastAccessed).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="enrollment-actions">
                  <Link
                    to={`/player/${enrollment.course._id}`}
                    className="btn btn-primary"
                  >
                    {enrollment.progress === 0 ? "Start Learning" : "Continue"}
                  </Link>

                  {enrollment.progress === 100 && (
                    <button
                      onClick={() => handleGenerateCertificate(enrollment._id)}
                      className="btn btn-success"
                    >
                      Get Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;

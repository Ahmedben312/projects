import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import ProgressChart from "../../components/student/ProgressChart";

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await API.get("/progress/my-courses");
      setEnrollments(response.data.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your courses...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>My Learning Dashboard</h1>

      {/* Progress Overview */}
      <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2>Learning Progress</h2>
        <ProgressChart progressData={null} />
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 style={{ marginBottom: "1rem" }}>My Courses</h2>

        {enrollments.length === 0 ? (
          <div
            className="card"
            style={{ padding: "2rem", textAlign: "center" }}
          >
            <h3>No courses enrolled yet</h3>
            <p>Start your learning journey by enrolling in a course!</p>
            <Link to="/" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="course-card">
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  className="course-thumbnail"
                />
                <div className="course-content">
                  <h3 className="course-title">{enrollment.course.title}</h3>
                  <p className="course-instructor">
                    By {enrollment.course.instructor?.name}
                  </p>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <p style={{ textAlign: "center", margin: "0.5rem 0" }}>
                    {enrollment.progress}% Complete
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    <Link
                      to={`/player/${enrollment.course._id}`}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      {enrollment.progress === 0
                        ? "Start Learning"
                        : "Continue"}
                    </Link>

                    {enrollment.progress === 100 && (
                      <button className="btn btn-success">
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
    </div>
  );
};

export default Dashboard;

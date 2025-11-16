import React, { useState, useEffect } from "react";
import API from "../../utils/api";

const InstructorDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      const [analyticsResponse, coursesResponse] = await Promise.all([
        API.get("/progress/analytics"),
        API.get("/courses"),
      ]);

      setAnalytics(analyticsResponse.data.data);
      setCourses(coursesResponse.data.data);
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Instructor Dashboard</h1>

      {/* Analytics Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="card"
          style={{ padding: "1.5rem", textAlign: "center" }}
        >
          <h3>Total Students</h3>
          <p style={{ fontSize: "2rem", color: "#007bff", margin: 0 }}>
            {analytics?.totalStudents || 0}
          </p>
        </div>

        <div
          className="card"
          style={{ padding: "1.5rem", textAlign: "center" }}
        >
          <h3>Completed Courses</h3>
          <p style={{ fontSize: "2rem", color: "#28a745", margin: 0 }}>
            {analytics?.completedCourses || 0}
          </p>
        </div>

        <div
          className="card"
          style={{ padding: "1.5rem", textAlign: "center" }}
        >
          <h3>Average Progress</h3>
          <p style={{ fontSize: "2rem", color: "#ffc107", margin: 0 }}>
            {analytics?.averageProgress || 0}%
          </p>
        </div>
      </div>

      {/* Course Analytics */}
      <div className="card" style={{ padding: "2rem" }}>
        <h2>Course Performance</h2>
        <div style={{ marginTop: "1rem" }}>
          {analytics?.courseAnalytics?.map((course) => (
            <div
              key={course.courseId}
              style={{
                padding: "1rem",
                border: "1px solid #eee",
                marginBottom: "0.5rem",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ margin: 0 }}>{course.courseTitle}</h4>
                <span>
                  Completion Rate: {course.completionRate.toFixed(1)}%
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                }}
              >
                <span>Enrollments: {course.totalEnrollments}</span>
                <span>Completed: {course.completedEnrollments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Courses */}
      <div style={{ marginTop: "2rem" }}>
        <h2>My Courses</h2>
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="course-thumbnail"
              />
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p>{course.shortDescription}</p>
                <div className="course-meta">
                  <span>Students: {course.totalStudents}</span>
                  <span>${course.price}</span>
                </div>
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Edit Course
                  </button>
                  <button className="btn btn-outline">Analytics</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

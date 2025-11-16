import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import CourseForm from "../../components/educator/CourseForm";
import EmptyState from "../../components/common/EmptyState";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await API.get("/courses?instructor=true");
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleSaveCourse = (savedCourse) => {
    if (editingCourse) {
      setCourses(
        courses.map((c) => (c._id === savedCourse._id ? savedCourse : c))
      );
    } else {
      setCourses([savedCourse, ...courses]);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const togglePublish = async (courseId, currentStatus) => {
    try {
      await API.put(`/courses/${courseId}`, { isPublished: !currentStatus });
      fetchMyCourses(); // Refresh the list
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your courses...</div>;
  }

  if (showForm) {
    return (
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>{editingCourse ? "Edit Course" : "Create New Course"}</h1>
          <button
            onClick={() => setShowForm(false)}
            className="btn btn-outline"
          >
            Back to Courses
          </button>
        </div>
        <CourseForm course={editingCourse} onSave={handleSaveCourse} />
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>My Courses</h1>
        <button onClick={handleCreateCourse} className="btn btn-primary">
          Create New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          message="Start by creating your first course to share your knowledge with students."
          actionText="Create Your First Course"
          actionLink="#"
          showAction={true}
        />
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-status">
                <span
                  className={`status-badge ${
                    course.isPublished ? "published" : "draft"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="course-thumbnail"
              />
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                  {course.shortDescription ||
                    course.description.substring(0, 100)}
                  ...
                </p>

                <div className="course-stats">
                  <span>👥 {course.totalStudents} students</span>
                  <span>⭐ {course.rating}/5</span>
                </div>

                <div
                  className="course-actions"
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      togglePublish(course._id, course.isPublished)
                    }
                    className={`btn ${
                      course.isPublished ? "btn-warning" : "btn-success"
                    }`}
                  >
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

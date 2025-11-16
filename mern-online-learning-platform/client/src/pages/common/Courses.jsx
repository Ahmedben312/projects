import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    search: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Mock data
      const mockCourses = [
        {
          _id: "1",
          title: "React Fundamentals",
          instructor: { name: "John Doe" },
          thumbnail:
            "https://via.placeholder.com/300x200/007bff/ffffff?text=React+Course",
          shortDescription: "Learn React from scratch with hands-on projects",
          level: "beginner",
          category: "web-development",
          price: 49.99,
          totalStudents: 150,
          rating: 4.5,
          totalHours: 10,
        },
        {
          _id: "2",
          title: "Node.js Backend Development",
          instructor: { name: "Jane Smith" },
          thumbnail:
            "https://via.placeholder.com/300x200/28a745/ffffff?text=Node.js+Course",
          shortDescription:
            "Build scalable backend APIs with Node.js and Express",
          level: "intermediate",
          category: "web-development",
          price: 59.99,
          totalStudents: 89,
          rating: 4.7,
          totalHours: 15,
        },
        {
          _id: "3",
          title: "MongoDB Database Design",
          instructor: { name: "Mike Johnson" },
          thumbnail:
            "https://via.placeholder.com/300x200/dc3545/ffffff?text=MongoDB+Course",
          shortDescription: "Master MongoDB and database design patterns",
          level: "advanced",
          category: "data-science",
          price: 69.99,
          totalStudents: 45,
          rating: 4.8,
          totalHours: 12,
        },
        {
          _id: "4",
          title: "JavaScript Advanced Concepts",
          instructor: { name: "Sarah Wilson" },
          thumbnail:
            "https://via.placeholder.com/300x200/ffc107/000000?text=JavaScript+Course",
          shortDescription: "Deep dive into advanced JavaScript patterns",
          level: "intermediate",
          category: "web-development",
          price: 54.99,
          totalStudents: 120,
          rating: 4.6,
          totalHours: 8,
        },
        {
          _id: "5",
          title: "Python for Data Science",
          instructor: { name: "Emily Chen" },
          thumbnail:
            "https://via.placeholder.com/300x200/20c997/ffffff?text=Python+Course",
          shortDescription: "Learn Python and data analysis techniques",
          level: "beginner",
          category: "data-science",
          price: 49.99,
          totalStudents: 180,
          rating: 4.4,
          totalHours: 14,
        },
        {
          _id: "6",
          title: "UI/UX Design Principles",
          instructor: { name: "Alex Rodriguez" },
          thumbnail:
            "https://via.placeholder.com/300x200/6f42c1/ffffff?text=Design+Course",
          shortDescription: "Learn modern UI/UX design principles and tools",
          level: "beginner",
          category: "design",
          price: 44.99,
          totalStudents: 95,
          rating: 4.3,
          totalHours: 9,
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.shortDescription
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesCategory =
      !filters.category || course.category === filters.category;
    const matchesLevel = !filters.level || course.level === filters.level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="container">
      <div className="courses-header">
        <h1>All Courses</h1>
        <p>Discover our comprehensive collection of courses</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-controls">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
          <select
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course._id} className="course-card">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="course-thumbnail"
            />
            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">By {course.instructor?.name}</p>
              <p className="course-description">{course.shortDescription}</p>
              <div className="course-meta">
                <span className="course-level">{course.level}</span>
                <span className="course-rating">⭐ {course.rating}</span>
              </div>
              <div className="course-footer">
                <span className="course-price">${course.price}</span>
                <span className="course-students">
                  {course.totalStudents} students
                </span>
              </div>
              <Link
                to={`/courses/${course._id}`}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-results">
          <h3>No courses found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default Courses;

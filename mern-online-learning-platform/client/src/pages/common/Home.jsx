import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      // Mock data for demonstration
      const mockCourses = [
        {
          _id: "1",
          title: "React Fundamentals",
          instructor: { name: "John Doe" },
          thumbnail:
            "https://via.placeholder.com/300x200/007bff/ffffff?text=React+Course",
          shortDescription: "Learn React from scratch with hands-on projects",
          level: "beginner",
          price: 49.99,
          totalStudents: 150,
          rating: 4.5,
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
          price: 59.99,
          totalStudents: 89,
          rating: 4.7,
        },
        {
          _id: "3",
          title: "MongoDB Database Design",
          instructor: { name: "Mike Johnson" },
          thumbnail:
            "https://via.placeholder.com/300x200/dc3545/ffffff?text=MongoDB+Course",
          shortDescription: "Master MongoDB and database design patterns",
          level: "advanced",
          price: 69.99,
          totalStudents: 45,
          rating: 4.8,
        },
        {
          _id: "4",
          title: "JavaScript Advanced Concepts",
          instructor: { name: "Sarah Wilson" },
          thumbnail:
            "https://via.placeholder.com/300x200/ffc107/000000?text=JavaScript+Course",
          shortDescription: "Deep dive into advanced JavaScript patterns",
          level: "intermediate",
          price: 54.99,
          totalStudents: 120,
          rating: 4.6,
        },
        {
          _id: "5",
          title: "Full Stack Web Development",
          instructor: { name: "David Brown" },
          thumbnail:
            "https://via.placeholder.com/300x200/6f42c1/ffffff?text=Full+Stack+Course",
          shortDescription: "Complete MERN stack development course",
          level: "intermediate",
          price: 79.99,
          totalStudents: 200,
          rating: 4.9,
        },
        {
          _id: "6",
          title: "Python for Data Science",
          instructor: { name: "Emily Chen" },
          thumbnail:
            "https://via.placeholder.com/300x200/20c997/ffffff?text=Python+Course",
          shortDescription: "Learn Python and data analysis techniques",
          level: "beginner",
          price: 49.99,
          totalStudents: 180,
          rating: 4.4,
        },
      ];

      setCourses(mockCourses);

      // Uncomment when server is ready:
      // const response = await API.get('/courses?limit=6');
      // setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback mock data in case of error
      const fallbackCourses = [
        {
          _id: "1",
          title: "Web Development Basics",
          instructor: { name: "Demo Instructor" },
          thumbnail:
            "https://via.placeholder.com/300x200/6c757d/ffffff?text=Demo+Course",
          shortDescription: "Learn the fundamentals of web development",
          level: "beginner",
          price: 39.99,
          totalStudents: 100,
          rating: 4.0,
        },
      ];
      setCourses(fallbackCourses);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Learn Without Limits</h1>
            <p>
              Start, switch, or advance your career with thousands of courses
            </p>
            <Link to="/courses" className="btn btn-primary btn-large">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2>Featured Courses</h2>
          <p>Discover your perfect course from our collection</p>
        </div>

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
                <p className="course-instructor">
                  By {course.instructor?.name}
                </p>
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
      </section>
    </div>
  );
};

export default Home;

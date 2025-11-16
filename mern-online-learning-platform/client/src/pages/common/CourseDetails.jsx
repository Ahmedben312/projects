import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // Mock course data based on ID
      const mockCourses = {
        1: {
          _id: "1",
          title: "React Fundamentals",
          instructor: {
            name: "John Doe",
            bio: "Senior React Developer with 5+ years of experience",
          },
          thumbnail:
            "https://via.placeholder.com/800x400/007bff/ffffff?text=React+Fundamentals",
          description:
            "This comprehensive course will take you from React beginner to proficient developer. Learn about components, hooks, state management, and modern React patterns.",
          shortDescription: "Learn React from scratch with hands-on projects",
          level: "beginner",
          category: "web-development",
          price: 49.99,
          totalStudents: 150,
          rating: 4.5,
          totalHours: 10,
          lessons: [
            {
              _id: "1-1",
              title: "Introduction to React",
              description: "Get started with React basics",
              duration: 3600,
            },
            {
              _id: "1-2",
              title: "Components and Props",
              description: "Learn about React components",
              duration: 4200,
            },
            {
              _id: "1-3",
              title: "State and Lifecycle",
              description: "Understanding component state",
              duration: 4800,
            },
            {
              _id: "1-4",
              title: "Hooks in Depth",
              description: "Master React hooks",
              duration: 5400,
            },
          ],
          requirements: [
            "Basic HTML knowledge",
            "Basic JavaScript knowledge",
            "Text editor",
          ],
          learningOutcomes: [
            "Build modern React applications",
            "Understand React ecosystem",
            "State management with hooks",
            "Component composition patterns",
          ],
        },
        2: {
          _id: "2",
          title: "Node.js Backend Development",
          instructor: {
            name: "Jane Smith",
            bio: "Backend specialist and DevOps engineer",
          },
          thumbnail:
            "https://via.placeholder.com/800x400/28a745/ffffff?text=Node.js+Backend",
          description:
            "Master Node.js and build scalable backend applications. Learn about Express, MongoDB, authentication, and deployment.",
          shortDescription:
            "Build scalable backend APIs with Node.js and Express",
          level: "intermediate",
          category: "web-development",
          price: 59.99,
          totalStudents: 89,
          rating: 4.7,
          totalHours: 15,
          lessons: [
            {
              _id: "2-1",
              title: "Node.js Fundamentals",
              description: "Core Node.js concepts",
              duration: 3600,
            },
            {
              _id: "2-2",
              title: "Express Framework",
              description: "Building REST APIs with Express",
              duration: 5400,
            },
            {
              _id: "2-3",
              title: "Database Integration",
              description: "MongoDB and Mongoose",
              duration: 7200,
            },
          ],
          requirements: ["JavaScript knowledge", "Basic HTTP understanding"],
          learningOutcomes: [
            "Build RESTful APIs",
            "Database integration",
            "Authentication systems",
            "API deployment",
          ],
        },
        3: {
          _id: "3",
          title: "MongoDB Database Design",
          instructor: {
            name: "Mike Johnson",
            bio: "Database architect and MongoDB expert",
          },
          thumbnail:
            "https://via.placeholder.com/800x400/dc3545/ffffff?text=MongoDB+Database",
          description:
            "Learn MongoDB from basics to advanced topics. Master database design, aggregation, and performance optimization.",
          shortDescription: "Master MongoDB and database design patterns",
          level: "advanced",
          category: "data-science",
          price: 69.99,
          totalStudents: 45,
          rating: 4.8,
          totalHours: 12,
          lessons: [
            {
              _id: "3-1",
              title: "MongoDB Basics",
              description: "Introduction to NoSQL",
              duration: 3600,
            },
            {
              _id: "3-2",
              title: "Data Modeling",
              description: "Database design patterns",
              duration: 4800,
            },
            {
              _id: "3-3",
              title: "Aggregation Framework",
              description: "Advanced queries",
              duration: 6000,
            },
          ],
          requirements: ["Basic database concepts", "JavaScript knowledge"],
          learningOutcomes: [
            "MongoDB database design",
            "Performance optimization",
            "Aggregation pipelines",
            "Data modeling best practices",
          ],
        },
      };

      const foundCourse = mockCourses[id] || mockCourses["1"]; // Fallback to first course
      setCourse(foundCourse);

      if (user) {
        // Mock enrollment check
        const mockEnrollment = Math.random() > 0.5 ? { progress: 30 } : null;
        setEnrollment(mockEnrollment);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      // Mock enrollment
      setEnrollment({ progress: 0 });
      alert("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="container">
      <div className="course-header">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-hero-image"
        />
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p className="course-instructor">By {course.instructor?.name}</p>
          <p className="course-short-description">{course.shortDescription}</p>

          <div className="course-meta">
            <span className="course-level">{course.level}</span>
            <span className="course-students">
              {course.totalStudents} students
            </span>
            <span className="course-rating">⭐ {course.rating}/5</span>
          </div>

          <div className="course-actions">
            {enrollment ? (
              <Link to={`/player/${course._id}`} className="btn btn-primary">
                {enrollment.progress > 0
                  ? "Continue Learning"
                  : "Start Learning"}
              </Link>
            ) : (
              <div>
                <div className="course-price">${course.price}</div>
                <button onClick={handleEnroll} className="btn btn-primary">
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="course-details-grid">
        <div className="course-content">
          <div className="course-section">
            <h2>About This Course</h2>
            <p>{course.description}</p>
          </div>

          <div className="course-section">
            <h2>What You'll Learn</h2>
            <ul className="learning-outcomes">
              {course.learningOutcomes?.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="course-section">
            <h2>Course Content</h2>
            <div className="lessons-list">
              {course.lessons?.map((lesson, index) => (
                <div key={lesson._id} className="lesson-item">
                  <div className="lesson-info">
                    <span className="lesson-number">{index + 1}</span>
                    <div>
                      <h4>{lesson.title}</h4>
                      <p>{lesson.description}</p>
                    </div>
                  </div>
                  <span className="lesson-duration">
                    {Math.floor(lesson.duration / 60)}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="course-sidebar">
          <div className="sidebar-card">
            <h3>Course Features</h3>
            <ul className="features-list">
              <li>📺 {course.lessons?.length || 0} lessons</li>
              <li>⏱️ {course.totalHours || 0} total hours</li>
              <li>📱 Access on mobile and TV</li>
              <li>🏆 Certificate of completion</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Requirements</h3>
            <ul className="requirements-list">
              {course.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Instructor</h3>
            <div className="instructor-info">
              <strong>{course.instructor?.name}</strong>
              <p>{course.instructor?.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

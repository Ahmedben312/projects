import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/api";
import VideoPlayer from "../../components/common/VideoPlayer";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseResponse, enrollmentResponse] = await Promise.all([
        API.get(`/courses/${courseId}`),
        API.get(`/progress/my-courses`),
      ]);

      setCourse(courseResponse.data.data);

      // Find enrollment for this course
      const courseEnrollment = enrollmentResponse.data.data.find(
        (e) => e.course._id === courseId
      );
      setEnrollment(courseEnrollment);

      // Set current lesson from enrollment or start from first lesson
      if (courseEnrollment?.currentLesson) {
        const lessonIndex = courseResponse.data.data.lessons.findIndex(
          (lesson) => lesson._id === courseEnrollment.currentLesson
        );
        setCurrentLesson(lessonIndex >= 0 ? lessonIndex : 0);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = async (currentTime) => {
    if (!enrollment || !course) return;

    try {
      // Update progress every 30 seconds
      if (Math.round(currentTime) % 30 === 0) {
        await API.put(`/progress/${enrollment._id}/lesson`, {
          lessonId: course.lessons[currentLesson]._id,
          timeSpent: Math.round(currentTime),
          completed: false,
        });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const markLessonComplete = async () => {
    if (!enrollment || !course) return;

    try {
      await API.put(`/progress/${enrollment._id}/lesson`, {
        lessonId: course.lessons[currentLesson]._id,
        timeSpent: course.lessons[currentLesson].duration,
        completed: true,
      });

      // Refresh enrollment data
      fetchCourseData();
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  if (loading) {
    return <div className="loading">Loading course content...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  const lesson = course.lessons[currentLesson];

  return (
    <div className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "2rem",
        }}
      >
        {/* Main Content */}
        <div>
          <h1>{course.title}</h1>
          <h2>{lesson.title}</h2>

          <VideoPlayer
            options={{
              autoplay: false,
              controls: true,
              responsive: true,
              fluid: true,
              sources: [
                {
                  src: lesson.videoUrl,
                  type: "video/mp4",
                },
              ],
            }}
            onTimeUpdate={handleTimeUpdate}
          />

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={handlePreviousLesson}
              disabled={currentLesson === 0}
              className="btn btn-outline"
            >
              Previous Lesson
            </button>

            <button onClick={markLessonComplete} className="btn btn-success">
              Mark Complete
            </button>

            <button
              onClick={handleNextLesson}
              disabled={currentLesson === course.lessons.length - 1}
              className="btn btn-primary"
            >
              Next Lesson
            </button>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3>About this lesson</h3>
            <p>{lesson.description}</p>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="card" style={{ padding: "1rem" }}>
          <h3>Course Content</h3>
          <div style={{ marginTop: "1rem" }}>
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    index === currentLesson ? "#f8f9fa" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentLesson(index)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {index + 1}. {lesson.title}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    {Math.floor(lesson.duration / 60)}m
                  </span>
                </div>
                {enrollment?.completedLessons.find(
                  (cl) => cl.lesson === lesson._id
                ) && (
                  <span style={{ color: "#28a745", fontSize: "0.8rem" }}>
                    ✓ Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;

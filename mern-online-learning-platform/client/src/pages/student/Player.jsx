import React from "react";
import { useParams } from "react-router-dom";
import CoursePlayer from "./CoursePlayer";

// This is just a wrapper component that redirects to CoursePlayer
// to maintain the directory structure
const Player = () => {
  const { courseId } = useParams();
  return <CoursePlayer />;
};

export default Player;

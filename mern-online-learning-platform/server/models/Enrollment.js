import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        timeSpent: {
          type: Number, // in seconds
          default: 0,
        },
      },
    ],
    currentLesson: {
      type: mongoose.Schema.Types.ObjectId,
    },
    progress: {
      type: Number, // percentage
      default: 0,
      min: 0,
      max: 100,
    },
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);

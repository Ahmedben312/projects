import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a lesson title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    videoUrl: {
      type: String,
      required: [true, "Please add a video URL"],
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: String,
        fileUrl: String,
        fileType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number, // index of correct option
    required: true,
  },
  explanation: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a course title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "web-development",
        "data-science",
        "mobile-development",
        "design",
        "business",
        "music",
        "photography",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    promotionalVideo: String,
    lessons: [lessonSchema],
    quizzes: [quizSchema],
    requirements: [String],
    learningOutcomes: [String],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: {
      type: String,
      default: "English",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);

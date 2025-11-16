import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: String,
    verificationCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate certificate ID before saving
certificateSchema.pre("save", function (next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  if (!this.verificationCode) {
    this.verificationCode = Math.random()
      .toString(36)
      .substr(2, 12)
      .toUpperCase();
  }
  next();
});

export default mongoose.model("Certificate", certificateSchema);

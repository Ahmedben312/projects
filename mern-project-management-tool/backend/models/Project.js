const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["manager", "member"],
          default: "member",
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);

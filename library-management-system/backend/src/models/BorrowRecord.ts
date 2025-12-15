import mongoose, { Document } from "mongoose";
import { IBorrowRecord } from "../types";

export type IBorrowRecordDocument = IBorrowRecord & Document;

const BorrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
    renewalCount: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
BorrowRecordSchema.index({ userId: 1, status: 1 });
BorrowRecordSchema.index({ bookId: 1, status: 1 });
BorrowRecordSchema.index({ dueDate: 1 });

export default mongoose.model<IBorrowRecordDocument>(
  "BorrowRecord",
  BorrowRecordSchema
);

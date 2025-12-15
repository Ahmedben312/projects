import mongoose, { Document } from "mongoose";
import { IBook } from "../types";

export type IBookDocument = IBook & Document;

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    copiesAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      default: "English",
    },
    pages: {
      type: Number,
      min: 1,
    },
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
BookSchema.index({ title: "text", author: "text", isbn: "text" });
BookSchema.index({ genre: 1 });
BookSchema.index({ publicationYear: 1 });

export default mongoose.model<IBookDocument>("Book", BookSchema);

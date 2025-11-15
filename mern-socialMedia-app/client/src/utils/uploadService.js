import axios from "axios";
import { API_BASE_URL } from "./api";

export const uploadFile = async (file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.file;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
  }
};

export const uploadMultipleFiles = async (files) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axios.post(
      `${API_BASE_URL}/upload/multiple`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.files;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload files");
  }
};

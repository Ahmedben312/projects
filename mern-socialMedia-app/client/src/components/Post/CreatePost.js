import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../features/posts/postsSlice";
import { uploadFile } from "../../utils/uploadService";
import "./CreatePost.css";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && media.length === 0) {
      alert("Please add some content or media to your post");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: content.trim(),
        media,
        isPublic,
      };

      await dispatch(createPost(postData)).unwrap();

      // Reset form
      setContent("");
      setMedia([]);
      setIsPublic(true);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    try {
      const uploadResults = await Promise.all(
        files.map((file) => uploadFile(file))
      );

      setMedia((prev) => [...prev, ...uploadResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files. Please try again.");
    }

    // Reset file input
    e.target.value = "";
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <img
          src={user?.profile?.avatar || "/default-avatar.png"}
          alt="Profile"
          className="user-avatar"
        />
        <div className="post-audience">
          <select
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === "true")}
            className="audience-select"
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="create-post-content">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${
              user?.profile?.firstName || user?.username
            }?`}
            className="post-textarea"
            rows="3"
          />

          {media.length > 0 && (
            <div className="media-preview">
              {media.map((file, index) => (
                <div key={index} className="media-item">
                  {file.type === "image" ? (
                    <img src={file.url} alt="Preview" />
                  ) : file.type === "video" ? (
                    <video src={file.url} controls />
                  ) : (
                    <div className="file-preview">
                      <span>📄</span>
                      <span>{file.filename}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="remove-media-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="create-post-actions">
          <div className="action-buttons">
            <button
              type="button"
              onClick={openFilePicker}
              className="action-btn"
            >
              📷 Photo/Video
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && media.length === 0) || isSubmitting}
            className="btn btn-primary post-submit-btn"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,video/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CreatePost;

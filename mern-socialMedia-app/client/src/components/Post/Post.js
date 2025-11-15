import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, addComment } from "../../features/posts/postsSlice";
import { formatTimestamp } from "../../utils/helpers";
import "./Post.css";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = post.likes.includes(user?.id);
  const isAuthor = post.author._id === user?.id;

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(addComment({ postId: post._id, content: commentText }));
    setCommentText("");
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.author.profile?.avatar || "/default-avatar.png"}
            alt={post.author.username}
            className="author-avatar"
          />
          <div className="author-info">
            <h4 className="author-name">
              {post.author.profile?.firstName && post.author.profile?.lastName
                ? `${post.author.profile.firstName} ${post.author.profile.lastName}`
                : post.author.username}
            </h4>
            <span className="post-time">{formatTimestamp(post.createdAt)}</span>
          </div>
        </div>

        {!post.isPublic && <span className="privacy-badge">Private</span>}
      </div>

      <div className="post-content">
        <p>{post.content}</p>

        {post.media.length > 0 && (
          <div className={`post-media media-${post.media.length}`}>
            {post.media.map((media, index) => (
              <div key={index} className="media-item">
                {media.type === "image" ? (
                  <img src={media.url} alt="Post media" />
                ) : media.type === "video" ? (
                  <video src={media.url} controls />
                ) : (
                  <div className="file-item">
                    <span>📄</span>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {media.filename}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="post-stats">
        <div className="stat-item">
          <span>{post.likes.length} likes</span>
        </div>
        <div className="stat-item">
          <span>{post.comments.length} comments</span>
        </div>
        <div className="stat-item">
          <span>{post.shares.length} shares</span>
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <span className="action-icon">👍</span>
          Like
        </button>

        <button className="action-btn" onClick={toggleComments}>
          <span className="action-icon">💬</span>
          Comment
        </button>

        <button className="action-btn">
          <span className="action-icon">🔄</span>
          Share
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="btn btn-primary comment-submit"
            >
              Post
            </button>
          </form>

          <div className="comments-list">
            {post.comments.length === 0 ? (
              <p className="no-comments">No comments yet</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <img
                    src={comment.user.profile?.avatar || "/default-avatar.png"}
                    alt={comment.user.username}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.user.profile?.firstName &&
                        comment.user.profile?.lastName
                          ? `${comment.user.profile.firstName} ${comment.user.profile.lastName}`
                          : comment.user.username}
                      </span>
                      <span className="comment-time">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button className="comment-action">Like</button>
                      <span className="comment-likes">
                        {comment.likes.length > 0 &&
                          `${comment.likes.length} likes`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

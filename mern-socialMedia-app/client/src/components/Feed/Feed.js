import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost } from "../../features/posts/postsSlice";
import Post from "../Post/Post";
import CreatePost from "../Post/CreatePost";
import "./Feed.css";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore, page } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (page === 1) {
      dispatch(fetchPosts(1));
    }
  }, [dispatch, page]);

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      await dispatch(fetchPosts(page + 1));
      setIsLoadingMore(false);
    }
  };

  const handleCreatePost = async (postData) => {
    await dispatch(createPost(postData));
  };

  if (loading && posts.length === 0) {
    return (
      <div className="feed">
        <div className="feed-header">
          <h2>Home</h2>
        </div>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <h2>Home</h2>
      </div>

      <CreatePost onSubmit={handleCreatePost} />

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}

            {hasMore && (
              <div className="load-more">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="btn btn-secondary"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../../features/posts/postsSlice";
import Post from "../Post/Post";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { posts, loading } = useSelector((state) => state.posts);

  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    // For now, we'll use current user as profile user
    // In a real app, you'd fetch the user profile based on userId
    setProfileUser(currentUser);
  }, [currentUser, userId]);

  useEffect(() => {
    if (profileUser) {
      dispatch(fetchPosts(1));
    }
  }, [dispatch, profileUser]);

  // Filter posts to show only user's posts on profile
  const userPosts = posts.filter(
    (post) =>
      post.author &&
      post.author._id === (isOwnProfile ? currentUser?.id : userId)
  );

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow API call
  };

  if (!profileUser) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover-photo">
          <img
            src={profileUser.profile?.coverImage || "/default-cover.jpg"}
            alt="Cover"
            className="cover-image"
          />
        </div>

        <div className="profile-info">
          <div className="profile-avatar-section">
            <img
              src={profileUser.profile?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          <div className="profile-details">
            <h1 className="profile-name">
              {profileUser.profile?.firstName && profileUser.profile?.lastName
                ? `${profileUser.profile.firstName} ${profileUser.profile.lastName}`
                : profileUser.username}
            </h1>

            <p className="profile-username">@{profileUser.username}</p>

            {profileUser.profile?.bio && (
              <p className="profile-bio">{profileUser.profile.bio}</p>
            )}

            <div className="profile-stats">
              <div className="stat">
                <strong>{userPosts.length}</strong>
                <span>Posts</span>
              </div>
              <div className="stat">
                <strong>{profileUser.followers?.length || 0}</strong>
                <span>Followers</span>
              </div>
              <div className="stat">
                <strong>{profileUser.following?.length || 0}</strong>
                <span>Following</span>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`btn ${
                  isFollowing ? "btn-secondary" : "btn-primary"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {isOwnProfile && (
              <button className="btn btn-primary">Edit Profile</button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "posts" && (
            <div className="posts-section">
              {loading ? (
                <div className="loading">Loading posts...</div>
              ) : userPosts.length === 0 ? (
                <div className="no-posts">
                  <h3>No posts yet</h3>
                  <p>
                    {isOwnProfile
                      ? "You haven't created any posts yet. Share your first post!"
                      : "This user hasn't posted anything yet."}
                  </p>
                </div>
              ) : (
                userPosts.map((post) => <Post key={post._id} post={post} />)
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="about-section">
              <div className="about-card">
                <h3>About</h3>
                <div className="about-details">
                  {profileUser.profile?.location && (
                    <div className="about-item">
                      <strong>Location:</strong>
                      <span>{profileUser.profile.location}</span>
                    </div>
                  )}
                  {profileUser.profile?.website && (
                    <div className="about-item">
                      <strong>Website:</strong>
                      <a
                        href={profileUser.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profileUser.profile.website}
                      </a>
                    </div>
                  )}
                  <div className="about-item">
                    <strong>Joined:</strong>
                    <span>
                      {new Date(profileUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

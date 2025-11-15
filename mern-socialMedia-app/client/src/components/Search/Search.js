import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../../features/users/usersSlice";
import { formatTimestamp } from "../../utils/helpers";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/users/search?q=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (query) {
        searchUsers();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = (user) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    navigate(`/profile/${user._id}`);
  };

  const handleInputFocus = () => {
    if (results.length > 0 || query.length >= 2) {
      setIsOpen(true);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="search-input"
        />
        {loading && <div className="search-loading">🔍</div>}
      </div>

      {isOpen && (results.length > 0 || query.length >= 2) && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading-text">Searching...</div>
          ) : results.length === 0 && query.length >= 2 ? (
            <div className="no-results">No users found</div>
          ) : (
            results.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => handleResultClick(user)}
              >
                <img
                  src={user.profile?.avatar || "/default-avatar.png"}
                  alt={user.username}
                  className="result-avatar"
                />
                <div className="result-info">
                  <div className="result-name">
                    {user.profile?.firstName && user.profile?.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.username}
                  </div>
                  <div className="result-username">@{user.username}</div>
                  <div className="result-stats">
                    {user.followersCount} followers • {user.followingCount}{" "}
                    following
                  </div>
                </div>
                {user.isOnline && (
                  <div className="online-indicator" title="Online"></div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

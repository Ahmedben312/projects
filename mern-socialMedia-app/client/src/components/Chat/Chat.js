import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../features/chat/chatSlice";
import "./Chat.css";

const Chat = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || "Group Chat";
    }

    const otherParticipants = conversation.participants?.filter(
      (p) => p._id !== user?.id
    );
    if (otherParticipants?.length === 1) {
      const participant = otherParticipants[0];
      return participant.profile?.firstName && participant.profile?.lastName
        ? `${participant.profile.firstName} ${participant.profile.lastName}`
        : participant.username;
    }

    return "Unknown User";
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.isGroup) {
      return conversation.groupAvatar || "";
    }

    const otherParticipants = conversation.participants?.filter(
      (p) => p._id !== user?.id
    );
    if (otherParticipants?.length === 1) {
      return otherParticipants[0].profile?.avatar || "/default-avatar.png";
    }

    return "/default-avatar.png";
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-header">
            <h2>Messages</h2>
            <button className="btn btn-primary">New Message</button>
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <h3>No conversations yet</h3>
                <p>Start a conversation with someone!</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`conversation-item ${
                    selectedConversation?._id === conversation._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <img
                    src={getConversationAvatar(conversation)}
                    alt={getConversationName(conversation)}
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h4 className="conversation-name">
                        {getConversationName(conversation)}
                      </h4>
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className="conversation-preview">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedConversation ? (
            <div className="chat-conversation">
              <div className="conversation-header">
                <h3>{getConversationName(selectedConversation)}</h3>
              </div>

              <div className="messages-container">
                <div className="no-messages">
                  <p>
                    Start a conversation with{" "}
                    {getConversationName(selectedConversation)}
                  </p>
                </div>
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button className="btn btn-primary send-button">Send</button>
              </div>
            </div>
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-icon">💬</div>
              <h3>Your Messages</h3>
              <p>Send private messages to friends or groups.</p>
              <button className="btn btn-primary">Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

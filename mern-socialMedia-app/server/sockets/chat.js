const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");

const setupChatSocket = (io, redisClient) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("User connected to chat:", socket.id);

    // Join user to their personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined chat`);
    });

    // Join conversation
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Send message
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, content, media } = data;

        // Create new message
        const message = new Message({
          conversation: conversationId,
          sender: senderId,
          content,
          media,
        });

        await message.save();
        await message.populate("sender", "username profile");

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
        });

        // Emit message to conversation room
        chatNamespace.to(conversationId).emit("new_message", message);

        // Get conversation to find other participants
        const conversation = await Conversation.findById(
          conversationId
        ).populate("participants");

        // Send notifications to other participants
        if (conversation && conversation.participants) {
          conversation.participants.forEach(async (participant) => {
            if (participant._id.toString() !== senderId) {
              const notification = new Notification({
                recipient: participant._id,
                sender: senderId,
                type: "message",
                message: message._id,
              });
              await notification.save();

              // Emit notification to recipient
              chatNamespace
                .to(participant._id.toString())
                .emit("notification", notification);
            }
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("typing_start", (data) => {
      socket.to(data.conversationId).emit("user_typing", {
        userId: data.userId,
        username: data.username,
      });
    });

    socket.on("typing_stop", (data) => {
      socket.to(data.conversationId).emit("user_stop_typing", {
        userId: data.userId,
      });
    });

    // Mark messages as read
    socket.on("mark_as_read", async (data) => {
      try {
        const { messageIds, userId } = data;

        await Message.updateMany(
          { _id: { $in: messageIds } },
          { $addToSet: { readBy: userId } }
        );

        socket.to(data.conversationId).emit("messages_read", {
          messageIds,
          userId,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from chat:", socket.id);
    });
  });

  return chatNamespace;
};

module.exports = setupChatSocket;

import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";

const Comment = ({ comment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          src={comment.user?.profilePicture}
          sx={{ width: 40, height: 40 }}
        >
          {comment.user?.username?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {comment.user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.createdAt)}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {comment.text}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Comment;

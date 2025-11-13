import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Pagination = ({ current, total, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(total, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (total <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
        gap: 1,
      }}
    >
      <Button
        variant="outlined"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        Previous
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant={1 === current ? "contained" : "outlined"}
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && <Typography>...</Typography>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === current ? "contained" : "outlined"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < total && (
        <>
          {endPage < total - 1 && <Typography>...</Typography>}
          <Button
            variant={total === current ? "contained" : "outlined"}
            onClick={() => onPageChange(total)}
          >
            {total}
          </Button>
        </>
      )}

      <Button
        variant="outlined"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;

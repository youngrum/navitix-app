"use client";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Stack, TextField } from "@mui/material";

function SearchTheater() {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        id="search-theater"
        variant="outlined"
        size="small"
        margin="normal"
        fullWidth
        color="secondary"
        placeholder="映画館・市区町村を入力"
      />
      <SearchOutlinedIcon fontSize="large" color="secondary" />
    </Stack>
  );
}

export default SearchTheater;

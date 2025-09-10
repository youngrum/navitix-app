"use client";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Stack, TextField } from "@mui/material";

interface placeHolderProps {
  placeHolderTextProps: string;
}

function SearchTextField({ placeHolderTextProps }: placeHolderProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        id="search-textField"
        variant="outlined"
        size="small"
        margin="normal"
        fullWidth
        color="secondary"
        placeholder={placeHolderTextProps}
      />
      <SearchOutlinedIcon fontSize="large" color="secondary" />
    </Stack>
  );
}

export default SearchTextField;

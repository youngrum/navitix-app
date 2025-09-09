"use client";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface SubmitButtonProps {
  isLoading: boolean;
  buttonText: string;
}

export default function SubmitButton({
  isLoading,
  buttonText,
}: SubmitButtonProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4}}>
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{ width: "80vw", maxWidth: "500px",minWidth: 0 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          buttonText
        )}
      </Button>
    </Box>
  );
}

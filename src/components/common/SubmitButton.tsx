"use client";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

interface SubmitButtonProps {
  isLoading: boolean;
  buttonText: string;
}

// ボタンデザイン定義
const CustomButton = styled(Button)({
  borderRadius: "25px",
  fontWeight: 400,
  minWidth: "80vw",
  width: "100%",
  maxWidth: "600px",
  height: "50px",
});

export default function SubmitButton({
  isLoading,
  buttonText,
}: SubmitButtonProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
      <CustomButton
        type="submit"
        variant="contained"
        disabled={isLoading}
        color="secondary"
        sx={{
          borderRadius: "25px",
          color: "#FFFFFF",
          fontWeight: 400,
          minWidth: "80vw",
          height: "50px",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          buttonText
        )}
      </CustomButton>
    </Box>
  );
}

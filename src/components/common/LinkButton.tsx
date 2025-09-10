"use client";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';

interface LinkButtonProps {
  buttonTextProps: string;
  toProps: string;
}

// ボタンデザイン定義
const CustomButton = styled(Button)({
  borderRadius: '25px',
  fontWeight: 400,
  minWidth: '80vw',
  height: '50px',
});

export default function LinkButton({
  buttonTextProps,
  toProps,
}: LinkButtonProps) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 2}}>
      <CustomButton
        type="button"
        variant="contained"
        color="secondary"
        onClick={() => router.push(toProps)}
      >
        {buttonTextProps}
      </CustomButton>
    </Box>
  );
}

"use client";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
  buttonTextProps: string;
  toProps: string;
}

export default function LinkButton({
  buttonTextProps,
  toProps,
}: LinkButtonProps) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 2}}>
      <Button
        type="button"
        variant="contained"
        sx={{ width: "80vw", maxWidth: "500px",minWidth: 0 }}
        onClick={() => router.push(toProps)}
      >
        {buttonTextProps}
      </Button>
    </Box>
  );
}

"use client";
import { Box, styled, Typography } from "@mui/material";

interface subTextProps {
  subText: string;
}

const CustomTypography = styled(Typography)({
  //   fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
});

export default function SubText({ subText }: subTextProps) {
  return (
    <Box sx={{ my: "2rem" }}>
      {/* clamp(最小値, 推奨値, 最大値) */}
      <CustomTypography variant="body2" color="primary">
        {subText}
      </CustomTypography>
    </Box>
  );
}

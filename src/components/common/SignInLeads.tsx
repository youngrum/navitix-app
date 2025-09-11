"use client";

import { styled, useTheme } from "@mui/material";
import { Box, Link, Typography } from "@mui/material";

interface LinkProps {
  leadTextProps: string;
  toProps: string;
  textAlignProps?: "left" | "right" | "center";
}

const CustomTypography = styled(Typography)({
  // fontSize: "clamp(14px, 2.5vw, 1.5rem)",
  fontSize: "14px",
});

export default function SignInLeads({
  leadTextProps,
  toProps,
  textAlignProps,
}: LinkProps) {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: "600px", my: "2rem" }}>
      <CustomTypography
        variant="body2"
        color="primary"
        sx={{ textAlign: textAlignProps }}
      >
        <Link href={toProps} sx={{ textDecoration: "none" }}>
          <span>{leadTextProps}</span>
          <span
            style={{ color: theme.palette.secondary.main, marginLeft: "4px" }}
          >
            こちら
          </span>
        </Link>
      </CustomTypography>
    </Box>
  );
}

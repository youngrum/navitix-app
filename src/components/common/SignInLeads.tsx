"use client";

import { useTheme } from "@mui/material";
import { Box, Link, Typography } from "@mui/material";

interface LinkProps{
    leadTextProps: string
    toProps : string;
}

export default function SignInLeads({leadTextProps, toProps}: LinkProps) {
    const theme = useTheme();

    return (
    <Box sx={{ my: "1.5rem" }}>
      <Typography sx={{ textAlign: "center" }}>
        <Link href={toProps} sx={{ textDecoration: 'none' }}>
          <span style={{ color: theme.palette.text.primary }}>
            {leadTextProps}
          </span>
          <span style={{ color: theme.palette.secondary.main, marginLeft: '4px' }}>
            こちら
          </span>
        </Link>
      </Typography>
    </Box>

    );
}
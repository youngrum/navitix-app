// src/components/ClientPageContent.tsx
"use client"; // クライアントコンポーネントであることを明示

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ClientPageContent() {
  const theme = useTheme(); // useThemeでテーマを取得 useThemeはCSRで使用可

  const handleClick = () => {
    alert(`現在のプライマリカラー: ${theme.palette.primary.main}`);
  };

  return (
    <Box
      sx={{
        // page.tsxの背景色をこちらで設定
        backgroundColor: theme.palette.background.default, // baseカラーのlightを背景色に使用
        padding: theme.spacing(4), // theme.spacingを使用
        width: "100%", // 例として追加
        textAlign: "center", // 例として追加
      }}
    >
      <Typography variant="h1" sx={{ mt: 4, color: theme.palette.secondary.dark }}>
        This is Client Component (CSR)
      </Typography>
      <Typography
        variant="h2"
        sx={{ m: 4, color: theme.palette.status.success }}
      >
        status palette success
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          sx={{
            color: theme.palette.secondary.dark,
          }}
          onClick={handleClick}
        >
          Primary Button
        </Button>

        <Button variant="outlined" color="secondary">
          Secondary Button
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.dark,
            "&:hover": {
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          Base Color Button
        </Button>
      </Stack>
    </Box>
  );
}

"use client"; // クライアントコンポーネントであることを明示

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

interface Header1Props {
  headerText: string;
}

export default function Header1({ headerText }: Header1Props) {
  const theme = useTheme(); // useThemeでテーマを取得 useThemeはCSRで使用可
  return (
    <Typography variant="h1" sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>
      {headerText}
    </Typography>
  );
}

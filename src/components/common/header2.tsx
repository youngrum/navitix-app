"use client"; // クライアントコンポーネントであることを明示

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

interface Header2Props {
  headerText: string;
}

export default function Header2({ headerText }: Header2Props) {
  const theme = useTheme(); // useThemeでテーマを取得 useThemeはCSRで使用可
  return (
    <Typography variant="h2" sx={{ color: theme.palette.text.primary }}>
      {headerText}
    </Typography>
  );
}

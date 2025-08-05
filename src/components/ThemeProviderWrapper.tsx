// src/components/ThemeProviderWrapper.tsx
"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import myProjectTheme from "@/styles/theme"; // カスタムテーマをインポート

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // MUIのテーマプロバイダーを使用して、ThemeProviderWrapperコンポーネントの子要素にのみカスタムテーマを適用
    <ThemeProvider theme={myProjectTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

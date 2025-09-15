// src/components/ThemeProviderWrapper.tsx
"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import myProjectTheme from "@/styles/theme"; // カスタムテーマをインポート
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Container } from "@mui/material";

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      {/* MUIのテーマプロバイダーを使用して、ThemeProviderWrapperコンポーネントの子要素にのみカスタムテーマを適用 */}
      <ThemeProvider theme={myProjectTheme}>
        <CssBaseline />
        {/* <Box sx={{ p: 1, maxWidth: "600px", mx: "auto" }}>{children}</Box> */}
        <Container maxWidth="sm" sx={{ py: 3 }}>
          {children}
        </Container>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

// src/styles/theme.ts
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    base: Palette["primary"]; // primaryと同じ構造のbaseカラーを追加
    status: {
      // 独自の構造を持つプロパティを追加
      success: string;
      warning: string;
      error: string;
    };
  }

  //baseプロパティは呼び出し元で必須ではないことを示すために、オプションとして定義
  interface PaletteOptions {
    base?: PaletteOptions["primary"]; // baseはprimaryと同じ構造を持つが、必須ではない
    status?: {
      success?: string;
      warning?: string;
      error?: string;
    };
  }
}
// カスタムテーマの作成
// MUIのcreateTheme関数を使用して、アプリケーション全体で使用するテーマを定義
const myProjectTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // 青系の色
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e", // 赤紫系の色
      light: "#e33371",
      dark: "#9a0036",
      contrastText: "#fff",
    },
    base: {
      // カスタムで定義した「ベースカラー」
      main: "#f5f5f5", // 非常に薄い灰色など、背景や要素の基盤となる色
      light: "#ffffff",
      dark: "#e0e0e0",
      contrastText: "#000", // 暗い背景に対する文字色
    },
    status: {
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
    },
  },
  typography: {
    // アプリケーションで使用するフォントファミリーや、h1, h2などのスタイルを定義
    fontFamily: ["Noto Sans JP", "Roboto", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#333", // ここで直接色を指定可能 paletteから参照する方が一般的
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
  },
});

export default myProjectTheme;

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
      available?: string;
      selected?: string;
      reserved?: string;
    };
  }
}
// カスタムテーマの作成
// MUIのcreateTheme関数を使用して、アプリケーション全体で使用するテーマを定義
const myProjectTheme = createTheme({
  palette: {
    primary: {
      // メインカラーとして使用
      main: "#8F8F8F", // グレー系の色
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff",
    },
    secondary: {
      // アクセントカラー として使用
      main: "#FE3323", // 赤紫系の色
      light: "#e33371",
      dark: "#9a0036",
      contrastText: "#fff",
    },
    background: {
      // ベースカラーとして定義
      default: "#ffffff", // アプリケーションの背景色
      paper: "#ffffff", // カードやモーダルの背景色
    },
    // 区切り線の色を定義
    divider: "#DADADA",

    // 座席の状態を示すためのカスタムカラー
    status: {
      available: "#ffffff", // 選択可能
      selected: "#FE3323", // 選択中・自身が購入済
      reserved: "#8F8F8F", // 他のユーザーが購入済
    },
    text: {
      primary: "#333333", // 濃いグレー
      secondary: "#666666", // 中間のグレー
      disabled: "#999999", // 薄いグレー
    },
  },
  typography: {
    // アプリケーションで使用するフォントファミリーや、h1, h2などのスタイルを定義
    fontFamily: ["Noto Sans JP", "Roboto", "sans-serif"].join(","),
    h1: {
      fontSize: "2.0rem",
      fontWeight: 400,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          // variant="contained"をサブミットボタンとしてデザインを共通化
          props: { variant: 'contained' },
          style: {
            borderRadius: '25px',
            backgroundColor: '#FE3323',
            color: "#FFFFFF",
            fontWeight: 400,
            minWidth: "80vw",
            height: "50px",
          },
        },
      ],
    },
  },
  
});

export default myProjectTheme;

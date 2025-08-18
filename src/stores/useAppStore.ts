import { create } from "zustand";
import Cookies from "js-cookie";

interface AppLoginState {
  token: string | null; // 認証トークン
  authName: string | null; // ログインユーザー名
  setToken: (token: string | null) => void; // トークンの取得
  setAuthName: (authName: string | null) => void; //ログインユーザー名の取得
  clearAuth: () => void; // 認証情報解放
}

// 初期値をCookieから取得
const getInitialState = (): {
  token: string | null;
  authName: string | null;
} => {
  const token = Cookies.get("token") || null;
  const authName = Cookies.get("authName") || null;
  return { token, authName };
};

export const useAppStore = create<AppLoginState>((set) => ({
  ...getInitialState(), // 初期値をCookieから取得
  setAuthName: (authName) => {
    // authNameの更新
    set({ authName });
    if (authName) {
      Cookies.set("authName", authName); // Cookieに保存
      //  Cookies.set("authName", authName, { expires: 7 }); // Cookieに保存 (7日間有効)
    } else {
      Cookies.remove("authName"); // nullの場合はCookieを削除
    }
  },
  setToken: (token) => {
    // tokenの更新
    set({ token });
    if (token) {
      Cookies.set("token", token, { expires: 7 }); // Cookieに保存 (例: 7日間有効)
    } else {
      Cookies.remove("token"); // nullの場合はCookieを削除
    }
  },
  clearAuth: () => {
    set({ authName: null, token: null });
    Cookies.remove("authName");
    Cookies.remove("token");
  },
}));

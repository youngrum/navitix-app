import { useAppStore } from "@/stores/useAppStore";
import api from "@/services/api";

export const loginWithCredentials = async (
  username: string,
  password: string
): Promise<void> => {
  // username, passwordはリクエスト先のDTO（Javaクラス）のフィールド名と一致させる
  const response = await api.post("/login", { username, password });
  console.log("axios response:", response);
  const token = response.data.data.token;
  const authName = response.data.data.username;
  // console.log('axios response:', authName);
  if (!token) throw new Error("トークンが取得できませんでした");
  // トークンを保存
  useAppStore.getState().setToken(token);
  // ユーザー名を保存
  useAppStore.getState().setAuthName(authName);
};

export const logout = () => {
  useAppStore.getState().clearAuth();
};

export const getToken = () => {
  return useAppStore.getState().token || localStorage.getItem("authToken");
};

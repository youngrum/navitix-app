import axios from "axios";
// import { getToken } from "@/lib/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // 必要に応じて環境変数化可能
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエスト前にトークンを自動挿入
// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;

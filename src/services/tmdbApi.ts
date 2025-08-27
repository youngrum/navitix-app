// src/services/tmdbApi.ts
import axios from "axios";

export function createTMDBInstance(token: string) {
  const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      language: "ja",
      region: "JP",
    },
  });

  // リクエスト前にトークンを自動挿入
  instance.interceptors.request.use((config) => {
    const token = process.env.TMDB_ACCESS_TOKEN;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // レスポンスinterceptorでより詳細な情報を取得
  instance.interceptors.response.use(
    (response) => {
      console.log(
        "API request successful:",
        response.status,
        response.config.url
      );
      return response;
    },
    (error) => {
      console.error("❌ API Error Details:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error(
        "Response Data:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.error(
        "Response Headers:",
        JSON.stringify(error.response?.headers, null, 2)
      );
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method);
      console.error(
        "Request Headers:",
        JSON.stringify(error.config?.headers, null, 2)
      );
      return Promise.reject(error);
    }
  );

  return instance;
}

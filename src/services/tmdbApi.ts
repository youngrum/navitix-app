import axios from 'axios'

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // 必要に応じて環境変数化可能
    headers: {
      accept: "application/json",
    },
    params: {
      language: "ja",
      region: "JP",
    },
})

// リクエスト前にトークンを自動挿入
tmdbApi.interceptors.request.use((config) => {
  const token = process.env.TMDB_ACCESS_TOKEN
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export default tmdbApi

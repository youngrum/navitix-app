import axios from 'axios'

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // 必要に応じて環境変数化可能
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
  },
})

// リクエスト前にトークンを自動挿入
tmdbApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
  return config
})

export default tmdbApi

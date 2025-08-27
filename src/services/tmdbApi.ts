//src/services/tmdaApi.ts
import axios from "axios";

const fetchTMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
  },
});


// リクエスト前にトークンを自動挿入
fetchTMDB.interceptors.request.use((config) => {
  const token = process.env.TMDB_API_SECRET
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default fetchTMDB;



// const fetchTMDB = async (url: string) => {
//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_SECRET}`,
//     },
//   };

//   try {
//     const res = await fetch(`https://api.themoviedb.org/3${url}`, options);

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     console.log(res);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return { error: error.message };
//   }
// };

// export default fetchTMDB;


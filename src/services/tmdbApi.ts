const fetchTMDB = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_SECRET}`,
    },
  };

  try {
    const res = await fetch(`https://api.themoviedb.org/3`, options);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
};

export default fetchTMDB;

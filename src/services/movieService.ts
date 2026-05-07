import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = "https://themoviedb.org";

export const fetchMovies = async({ query }: { query: string }) => {
  const response = await axios.get("/search/movie", {
    params: {
      query: query,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data.results;
};
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import  ReactPaginate   from "react-paginate";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";

import css from "./App.module.css";

export default function App() {
  
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies({ query, page }),
  enabled: query !== "",
  placeholderData: (previousData) => previousData,
});

useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [data]);

   const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
   };
   return (
    <>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />

      {isLoading || isFetching ? <Loader /> : null}

      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <>
          <MovieGrid
            movies={data.results}
            onSelect={setSelectedMovie}
          />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}





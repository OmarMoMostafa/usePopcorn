import { Box, MovieDetails, ResList, WatchedList } from "./components/Main";
import { Logo, Search, Result } from "./components/Nav";
import { useEffect, useState } from "react";

const API_KEY = "a8d7330b";
export const URL = "http://www.omdbapi.com/?apikey=" + API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [movieSelected, setMovieSelected] = useState(null);

  // useEffect(function () {
  //   setWatched(JSON.parse(localStorage.getItem("watched")));
  // }, []);

  useEffect(
    function () {
      async function searchMovie() {
        const res = await fetch(URL + `&s=${query}`);
        const data = await res.json();
        setMovies(data.Search);
      }
      searchMovie();
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <nav className="nav-bar">
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </nav>

      <main className="main">
        <Box>
          <ResList setMovieSelected={setMovieSelected} movies={movies} />
        </Box>
        <Box>
          {movieSelected ? (
            <MovieDetails
              watched={watched}
              setWatched={setWatched}
              setMovieSelected={setMovieSelected}
              id={movieSelected}
            />
          ) : (
            <WatchedList
              setMovieSelected={setMovieSelected}
              watched={watched}
            />
          )}
        </Box>
      </main>
    </>
  );
}

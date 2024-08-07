import { Logo, Search, Result } from "./components/Nav";
import { Box } from "./components/Main";
import { ResList } from "./components/ResultList";
import { WatchedList } from "./components/WatchedList";
import { MovieDetails } from "./components/MovieDetails";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function searchMovie() {
        try {
          setIsLoading(true);
          const res = await fetch(URL + `&s=${query}`);
          const data = await res.json();
          setMovies(data.Search);
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
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

  useEffect(function () {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        setMovieSelected(null);
      }
    });
  }, []);

  return (
    <>
      <nav className="nav-bar">
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </nav>

      <main className="main">
        <Box>
          <ResList
            isLoading={isLoading}
            setMovieSelected={setMovieSelected}
            movies={movies}
          />
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

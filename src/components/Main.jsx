import { useState, useEffect } from "react";
import { URL } from "../App";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// FIXME: try to make setMovieSelected less digging
export function ResList({ movies, setMovieSelected, isLoading }) {
  return (
    <ul className="list list-movies">
      {isLoading ? (
        <Loader />
      ) : (
        movies?.map((movie) => (
          <ResMovie
            setMovieSelected={setMovieSelected}
            movie={movie}
            key={movie.imdbID}
          />
        ))
      )}
    </ul>
  );
}

export function ResMovie({ movie, setMovieSelected }) {
  return (
    <li
      className="result"
      onClick={() => {
        setMovieSelected(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export function WatchedList({ watched, setMovieSelected }) {
  return (
    <>
      <Summary watched={watched} />

      <ul className="list list-movies">
        {watched &&
          watched.map((movie) => (
            <WatchedMovie
              setMovieSelected={setMovieSelected}
              key={movie.imdbID}
              movie={movie}
            />
          ))}
      </ul>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(2);

export function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const totlaRuntime = watched.reduce((acc, movie) => acc + movie.Runtime, 0);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        {/* TODO: add user rating and calculate average */}
        {/* <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p> */}
        <p>
          <span>⏳</span>
          <span>{totlaRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMovie({ movie, setMovieSelected }) {
  return (
    <li onClick={() => setMovieSelected(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        {/* <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p> */}
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
      </div>
    </li>
  );
}

export function MovieDetails({ id, setMovieSelected, watched, setWatched }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watched.map((movie) => movie.imdbID).includes(id);

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(URL + `&i=${id}`);
          const data = await res.json();
          const runtime = Number(data.Runtime.split(" ")[0]);
          setMovieDetails({ ...data, Runtime: runtime });
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      }

      getMovieDetails();
    },
    [id]
  );

  useEffect(
    function () {
      if (!movieDetails?.Title) return;
      document.title = "Movie | " + movieDetails?.Title;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [movieDetails]
  );

  function addBtnHandler() {
    if (isWatched) {
      setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    } else {
      setWatched((watched) => [movieDetails, ...watched]);
    }
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        movieDetails && (
          <>
            <header>
              <button
                className="btn-back"
                onClick={() => setMovieSelected(null)}
              >
                &larr;
              </button>
              <img
                src={movieDetails.Poster}
                alt={`Poster of ${movieDetails.Title} movie`}
              />
              <div className="details-overview">
                <h2>{movieDetails.Title}</h2>
                <p>
                  {movieDetails.Released} &bull; {movieDetails.Runtime} min
                </p>
                <p>{movieDetails.Genre}</p>
                <p>
                  <span>⭐️</span>
                  {movieDetails.ImdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <button className="btn-add" onClick={addBtnHandler}>
                {isWatched ? "- Remove from list" : "+ Add to list"}
              </button>
              <p>
                <em>{movieDetails.Plot}</em>
              </p>
              <p>Starring {movieDetails.Actors}</p>
              <p>Directed by {movieDetails.Director}</p>
            </section>
          </>
        )
      )}
    </div>
  );
}

export function Loader() {
  return <h2 className="loading">Loading ...</h2>;
}

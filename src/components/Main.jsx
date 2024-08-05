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
export function ResList({ movies, setMovieSelected }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <ResMovie
          setMovieSelected={setMovieSelected}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

export function ResMovie({ movie, setMovieSelected }) {
  return (
    <li
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

export function WatchedList({ watched }) {
  return (
    <>
      <Summary watched={watched} />

      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie key={movie.imdbID} movie={movie} />
        ))}
      </ul>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
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
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

export function MovieDetails({ id, setMovieSelected }) {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(URL + `&i=${id}`);
        const data = await res.json();
        console.log(data);
        setMovieDetails(data);
      }
      getMovieDetails();
    },
    [id]
  );

  return (
    <div className="details">
      {movieDetails ? (
        <>
          <header>
            <button className="btn-back" onClick={() => setMovieSelected(null)}>
              &larr;
            </button>
            <img
              src={movieDetails.Poster}
              alt={`Poster of ${movieDetails.Title} movie`}
            />
            <div className="details-overview">
              <h2>{movieDetails.Title}</h2>
              <p>
                {movieDetails.Released} &bull; {movieDetails.Runtime}
              </p>
              <p>{movieDetails.Genre}</p>
              <p>
                <span>⭐️</span>
                {movieDetails.ImdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <p>
              <em>{movieDetails.Plot}</em>
            </p>
            <p>Starring {movieDetails.Actors}</p>
            <p>Directed by {movieDetails.Director}</p>
          </section>
        </>
      ) : null}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Loader } from "./Main";
import { URL } from "../App";

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

  // changing page title according to selected movie
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
                  {movieDetails.imdbRating} IMDb rating
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

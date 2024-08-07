import { Loader } from "./Main";
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

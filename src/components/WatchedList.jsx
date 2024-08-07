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
  const totlaRuntime = watched.reduce((acc, movie) => acc + movie?.Runtime, 0);
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

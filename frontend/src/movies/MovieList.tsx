import React, { useState, useEffect } from 'react';
import { request } from './Fetch';

import { Movie, MovieResponse } from './Movies'

const MovieList = () => {

  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let mounted = true;
    request<MovieResponse>("http://localhost:3000/api/movie").then(movieData => {

      if (mounted) {
        if (typeof movieData.error === "string")
          setMovies([]);
        else
          setMovies(movieData.data);
      }
    });

    return () => {
      mounted = false;
    };

  }, [movies]);

  if (movies.length === 0) {
    return (<div>The database is empty.</div>)
  }
  else {
    return (
      <div>

        {movies.map((movie: Movie) =>
          <div key={movie._id}>
            <div>Movie - <span>{movie.name}</span></div>
            <div>Rating - <span>{movie.rating}</span></div>
            <div>Times - <span>
              {movie.time.map((time: string, index: number) => time + (index < movie.time.length - 1 ? ', ' : ''))}
            </span></div>
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default MovieList;
import React, { Component } from "react";
import MovieItem from "../movie-item/movie-item";
import "./movie-list.css";

class MovieList extends Component {
  render() {
    return (
      <ul className="movie-list">
        <MovieItem />
      </ul>
    );
  }
}

export default MovieList;

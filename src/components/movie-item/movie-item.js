import React, { Component } from 'react'
import { format } from 'date-fns'
import Movie from '../api/api'
import Genres from '../api/genres'
import { Card, Image, Rate, Progress, Typography } from 'antd'

import './movie-item.css'

class MovieItem extends Component {
  state = {
    movies: [],
  }

  movie = new Movie()
  genres = new Genres()

  async componentDidMount() {
    const movies = await this.movie.getMovie()
    const genres = await this.genres.getGenres()

    const moviesWithGenres = movies.map((movie) => {
      const genre_names = movie.genre_ids.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean)

      return {
        ...movie,
        genre_names,
      }
    })

    this.setState({ movies: moviesWithGenres })
  }

  render() {
    const { movies } = this.state
    return (
      <>
        {movies.map((item) => (
          <Card hoverable key={item.id}>
            <li className="card">
              <div className="card__img-wrapper">
                <img
                  className="card__img"
                  src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                  alt={item.title}
                />
              </div>
              <div className="card__content">
                <h3 className="card__title">{item.title}</h3>
                <p className="card__date">{format(new Date(item.release_date), 'MMMM d, y')}</p>
                {/* release_date */}
                <ul className="card__genre">
                  {item.genre_names.map((genre, index) => (
                    <p className="card__genre-item" key={index}>
                      {genre}
                    </p>
                  ))}
                </ul>
                <Typography.Paragraph ellipsis={{ rows: 4 }} style={{ marginBottom: 0 }}>
                  {item.overview}
                </Typography.Paragraph>
              </div>
            </li>
          </Card>
        ))}
      </>
    )
  }
}

export default MovieItem

import React, { Component } from 'react'
import { format } from 'date-fns'
import { Card, Typography, Spin, Rate } from 'antd'

import Connect from '../connect/connect.js'
import './movie-item.css'

class MovieItem extends Component {
  render() {
    const { vote, movies, online, loading, updateRateForTask } = this.props

    const connect = !online ? <Connect /> : null
    const alert = loading ? <Spin className="spinner" size="large" /> : null

    let content
    if (loading) {
      content = <Spin />
    } else if (!movies || movies.length === 0) {
      content = <div className="not-found">Ничего не найдено</div>
    } else {
      content = <MovieView movies={movies} vote={vote} updateRateForTask={updateRateForTask} />
    }

    return (
      <>
        {connect}
        {alert}
        {content}
      </>
    )
  }
}

const MovieView = ({ vote, movies, updateRateForTask }) => {
  return (
    <React.Fragment>
      {movies.map((item) => (
        <Card hoverable key={item.id}>
          <li className="card">
            <div className="card__img-wrapper">
              <img
                className="card__img"
                src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                alt={item.title}
              />
            </div>
            <div className="card__content">
              <div className="card__content-header">
                <h3 className="card__title">{item.title || item.name || 'Unknown name'}</h3>
                <span className={`card__vote ${vote(item.vote_average || 0)}`}>
                  {item.vote_average === 0 ? 0 : Number.isFinite(item.vote_average) ? item.vote_average.toFixed(1) : 0}
                </span>
              </div>
              {item.release_date ? (
                <p className="card__date">{format(new Date(item.release_date), 'MMMM d, y')}</p>
              ) : (
                <p className="card__date">Unknown date</p>
              )}
              {item.genre_names ? (
                <ul className="card__genre">
                  {item.genre_names.map((genre, index) => (
                    <li className="card__genre-item" key={index}>
                      {genre}
                    </li>
                  ))}{' '}
                </ul>
              ) : (
                ''
              )}
              <Typography.Paragraph className="card__description" ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                {item.overview}
              </Typography.Paragraph>
              <Rate value={item.rating_star} onChange={(value) => updateRateForTask(item.id, value)} />
            </div>
          </li>
        </Card>
      ))}
    </React.Fragment>
  )
}

export default MovieItem

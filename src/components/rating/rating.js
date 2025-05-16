import React, { Component } from 'react'
import { format } from 'date-fns'
import { Card, Typography, Rate, Spin } from 'antd'

import Connect from '../connect/connect.js'
import './rating.css'

class Rating extends Component {
  render() {
    const { vote, loading, online, moviesWithRate, updateRateForTask, toggleShowSearchOrRating } = this.props
    const hasData = !(online || loading)
    const connect = !online ? <Connect /> : null
    const alert = loading ? <Spin className="spinner" size="large" /> : null

    let content
    if (loading) {
      content = <Spin />
    }
    if (!hasData) {
      content = (
        <MovieView
          vote={vote}
          updateRateForTask={updateRateForTask}
          moviesWithRate={moviesWithRate}
          toggleShowSearchOrRating={toggleShowSearchOrRating}
        />
      )
    }

    return (
      <div className="rating">
        <div className="search">
          <div className="search__toggle">
            <button className="btn btn__search" onClick={() => toggleShowSearchOrRating()}>
              Search
            </button>
            <button className="btn btn__active btn__rating" onClick={() => toggleShowSearchOrRating()}>
              Rating
            </button>
          </div>
        </div>
        {content}
        {alert}
        {connect}
      </div>
    )
  }
}

const MovieView = ({ vote, moviesWithRate, updateRateForTask }) => {
  if (!Array.isArray(moviesWithRate)) return null
  return (
    <React.Fragment>
      {moviesWithRate.map((item, index) => (
        <Card hoverable key={item.id || index}>
          {' '}
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
                  ))}
                </ul>
              ) : null}
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

export default Rating

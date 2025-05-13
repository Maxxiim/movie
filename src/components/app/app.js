import React, { Component } from 'react'

import MovieList from '../movie-list/movie-list.js'
import Rating from '../rating/rating.js'
import Movie from '../api/api.js'
import Multy from '../api/multi.js'
import { GenresConsumer } from '../api/genre-context.js'

import './app.css'

class App extends Component {
  state = {
    showCompSearchOrRate: true,
    movies: [],
    newMovie: [],
    loading: true,
    vote_average: 0,
    online: window.navigator.onLine,
    searchPerformed: false,
    totalMovies: 0,
    currentPage: 1,
    sortOption: 'popular',
  }

  movie = new Movie()
  multy = new Multy()

  async componentDidMount() {
    window.addEventListener('online', this.updateStatus)
    window.addEventListener('offline', this.updateStatus)

    const movies = await this.movie.getMovie()
    const storageLocal = localStorage.getItem('moviesWithRate')
    const moviesWithRate = storageLocal ? JSON.parse(storageLocal) : []

    const syncRating = (apiMovies) => {
      return apiMovies.map((movie) => {
        const ratedMovie = moviesWithRate.find((rated) => rated.id === movie.id)
        if (ratedMovie) {
          // Синхронизируем rating_star, если они различаются
          if (movie.rating_star !== ratedMovie.rating_star) {
            return {
              ...movie,
              rating_star: ratedMovie.rating_star,
            }
          }
        }
        return {
          ...movie,
          rating_star: typeof movie.rating_star === 'number' ? movie.rating_star : 0,
        }
      })
    }

    const updatedMovies = syncRating(movies)
    const updatedNewMovies = syncRating(this.state.newMovie)

    this.setState({
      moviesWithRate: moviesWithRate,
      movies: updatedMovies,
      newMovie: updatedNewMovies,
      totalMovies: updatedMovies.length,
      loading: false,
    })
  }

  updateNewMovie = (movies, searchPerformed, totalSearchedMovies = 0) => {
    const storageLocal = localStorage.getItem('moviesWithRate')
    const moviesWithRate = storageLocal ? JSON.parse(storageLocal) : []

    const updatedNewMovies = movies.map((movie) => {
      const ratedMovie = moviesWithRate.find((rated) => rated.id === movie.id)
      if (ratedMovie) {
        return {
          ...movie,
          rating_star: ratedMovie.rating_star,
        }
      }
      return {
        ...movie,
        rating_star: typeof movie.rating_star === 'number' ? movie.rating_star : 0,
      }
    })

    this.setState({
      newMovie: updatedNewMovies,
      searchPerformed,
      totalSearchedMovies,
    })
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateStatus)
    window.removeEventListener('offline', this.updateStatus)
  }

  updateStatus = () => {
    this.setState({ online: window.navigator.onLine })
  }

  updateRateForTask = (id, value) => {
    this.setState((prevState) => {
      const updatedMovies = prevState.movies.map((movie) =>
        movie.id === id ? { ...movie, rating_star: value } : movie
      )

      const updatedNewMovie = prevState.newMovie.map((movie) =>
        movie.id === id ? { ...movie, rating_star: value } : movie
      )

      let updatedRated = prevState.moviesWithRate.map((movie) =>
        movie.id === id ? { ...movie, rating_star: value } : movie
      )

      const updatedMovie =
        updatedMovies.find((movie) => movie.id === id) ||
        updatedNewMovie.find((movie) => movie.id === id) ||
        prevState.moviesWithRate.find((movie) => movie.id === id)

      const isInRated = updatedRated.some((movie) => movie.id === id)
      if (value > 0 && !isInRated && updatedMovie) {
        updatedRated.push({ ...updatedMovie, rating_star: value })
      }

      if (value === 0) {
        updatedRated = updatedRated.filter((movie) => movie.id !== id)
      }

      localStorage.setItem('moviesWithRate', JSON.stringify(updatedRated))
      return {
        movies: updatedMovies,
        newMovie: updatedNewMovie,
        moviesWithRate: updatedRated,
      }
    })
  }

  toggleShowSearchOrRating = () => {
    this.setState((prevState) => ({
      showCompSearchOrRate: !prevState.showCompSearchOrRate,
    }))
  }

  changeSortOption = (option) => {
    this.setState({ sortOption: option }, () => {
      this.fetchSortedMovies(option)
    })
  }

  fetchSortedMovies = async (sortOption) => {
    const { currentPage } = this.state
    const response = await this.movie.getMovie(sortOption, currentPage)

    this.setState({
      movies: response.results,
      totalMovies: response.total_results,
      loading: false,
    })
  }

  handlePaginationChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.fetchSortedMovies(this.state.sortOption)
    })
  }

  getVoteClass = (vote) => {
    if (vote <= 3) {
      return 'card__vote-red'
    } else if (vote <= 5) {
      return 'card__vote-orange'
    } else if (vote <= 7) {
      return 'card__vote-yellow'
    } else {
      return 'card__vote-green'
    }
  }

  render() {
    const {
      totalSearchedMovies,
      showCompSearchOrRate,
      movies,
      newMovie,
      searchPerformed,
      online,
      loading,
      totalMovies,
      currentPage,
      moviesWithRate,
    } = this.state

    return (
      <GenresConsumer>
        {(genres) => {
          const moviesWithGenres = movies.map((movie) => {
            const genre_names = movie.genre_ids.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean)
            return {
              ...movie,
              genre_names,
              rating_star: typeof movie.rating_star === 'number' ? movie.rating_star : 0,
            }
          })

          return (
            <div className="container">
              {showCompSearchOrRate ? (
                <MovieList
                  totalSearchedMovies={totalSearchedMovies}
                  vote={this.getVoteClass}
                  multy={this.multy}
                  movie={this.movie}
                  genres={genres}
                  movies={moviesWithGenres}
                  newMovie={newMovie}
                  searchPerformed={searchPerformed}
                  updateNewMovie={this.updateNewMovie}
                  online={online}
                  loading={loading}
                  totalMovies={totalMovies}
                  currentPage={currentPage}
                  updateRateForTask={this.updateRateForTask}
                  toggleShowSearchOrRating={this.toggleShowSearchOrRating}
                  handlePaginationChange={this.handlePaginationChange}
                />
              ) : (
                <Rating
                  vote={this.getVoteClass}
                  online={online}
                  loading={loading}
                  moviesWithRate={moviesWithRate}
                  updateRateForTask={this.updateRateForTask}
                  toggleShowSearchOrRating={this.toggleShowSearchOrRating}
                />
              )}
            </div>
          )
        }}
      </GenresConsumer>
    )
  }
}

export default App

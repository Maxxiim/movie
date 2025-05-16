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
    searchResults: [],
    loading: false,
    moviesWithRate: [],
    online: window.navigator.onLine,
    searchPerformed: false,
    totalMovies: 0,
    currentPage: 1,
    sortOption: 'popularity.desc',
    searchQuery: '',
  }

  movie = new Movie()
  multy = new Multy()

  componentDidMount() {
    window.addEventListener('online', this.updateStatus)
    window.addEventListener('offline', this.updateStatus)

    this.loadMovies()
    this.loadRatings()
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateStatus)
    window.removeEventListener('offline', this.updateStatus)
  }

  updateStatus = () => {
    this.setState({ online: window.navigator.onLine })
  }

  loadRatings = () => {
    const stored = localStorage.getItem('moviesWithRate')
    const moviesWithRate = stored ? JSON.parse(stored) : []
    this.setState({ moviesWithRate })
  }

  loadMovies = async () => {
    this.setState({ loading: true })
    try {
      const data = await this.movie.getResourse(this.state.sortOption, this.state.currentPage)
      const movies = data?.results || []
      this.setState({
        movies: this.syncRatings(movies),
        totalMovies: data?.total_results || 0,
        loading: false,
        searchPerformed: false,
        searchQuery: '',
        searchResults: [],
      })
    } catch (e) {
      console.error('Ошибка загрузки фильмов:', e)
      this.setState({ loading: false })
    }
  }

  syncRatings = (movies) => {
    const { moviesWithRate } = this.state
    return movies.map((movie) => {
      const rated = moviesWithRate.find((m) => m.id === movie.id)
      return {
        ...movie,
        rating_star: rated ? rated.rating_star : 0,
      }
    })
  }

  handleSearch = async (query, page = 1) => {
    if (!query) {
      this.loadMovies()
      return
    }
    this.setState({ loading: true })
    try {
      const data = await this.multy.getMulti(query, page)
      const results = data?.results || []
      this.setState({
        searchResults: this.syncRatings(results),
        totalMovies: data?.total_results || 0,
        currentPage: page,
        loading: false,
        searchPerformed: true,
        searchQuery: query,
      })
    } catch (e) {
      console.error('Ошибка поиска:', e)
      this.setState({ loading: false })
    }
  }

  handleInputSearch = (e) => {
    const query = e.target.value.trim()
    this.setState({ searchQuery: query }, () => {
      this.handleSearch(query)
    })
  }

  handlePageChange = (page) => {
    const { searchPerformed, searchQuery } = this.state
    if (searchPerformed) {
      this.handleSearch(searchQuery, page)
    } else {
      this.setState({ currentPage: page }, this.loadMovies)
    }
  }

  updateRateForTask = (id, rating_star) => {
    this.setState((prev) => {
      const updateList = (list) => list.map((m) => (m.id === id ? { ...m, rating_star } : m))

      const movies = updateList(prev.movies)
      const searchResults = updateList(prev.searchResults)

      let moviesWithRate = prev.moviesWithRate.filter((m) => m.id !== id)

      if (rating_star > 0) {
        const movie = movies.find((m) => m.id === id) || searchResults.find((m) => m.id === id)
        if (movie) {
          moviesWithRate = [...moviesWithRate, { ...movie, rating_star }]
        }
      }

      localStorage.setItem('moviesWithRate', JSON.stringify(moviesWithRate))

      return { movies, searchResults, moviesWithRate }
    })
  }

  toggleShowSearchOrRating = () => {
    this.setState((prev) => ({
      showCompSearchOrRate: !prev.showCompSearchOrRate,
    }))
  }

  changeSortOption = (option) => {
    const mapSortOptions = {
      popular: 'popularity.desc',
      release_date: 'release_date.desc',
      vote_average: 'vote_average.desc',
    }

    const sortOption = mapSortOptions[option] || 'popularity.desc'

    this.setState({ sortOption, currentPage: 1 }, this.loadMovies)
  }

  getVoteClass = (vote) => {
    if (vote <= 3) return 'card__vote-red'
    if (vote <= 5) return 'card__vote-orange'
    if (vote <= 7) return 'card__vote-yellow'
    return 'card__vote-green'
  }

  render() {
    const {
      showCompSearchOrRate,
      movies,
      searchResults,
      loading,
      online,
      searchPerformed,
      totalMovies,
      currentPage,
      moviesWithRate,
    } = this.state

    const moviesToShow = searchPerformed ? searchResults : movies

    return (
      <GenresConsumer>
        {(genres) => {
          const enrichedMovies = moviesToShow.map((movie) => {
            const genre_names = (movie.genre_ids || [])
              .map((id) => genres.find((g) => g.id === id)?.name)
              .filter(Boolean)
            return { ...movie, genre_names }
          })

          return (
            <div className="container">
              {showCompSearchOrRate ? (
                <MovieList
                  handleInputSearch={this.handleInputSearch}
                  vote={this.getVoteClass}
                  movies={enrichedMovies}
                  loading={loading}
                  online={online}
                  totalMovies={totalMovies}
                  currentPage={currentPage}
                  searchPerformed={searchPerformed}
                  updateRateForTask={this.updateRateForTask}
                  toggleShowSearchOrRating={this.toggleShowSearchOrRating}
                  handlePaginationChange={this.handlePageChange}
                  onSearch={this.handleSearch}
                  changeSortOption={this.changeSortOption}
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

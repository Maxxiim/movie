import React from 'react'
import { Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieItem from '../movie-item/movie-item.js'
import { GenresConsumer } from '../api/genre-context.js'
import Search from '../search/search.js'
import './movie-list.css'

const MovieList = ({
  vote,
  multy,
  movies,
  newMovie,
  searchPerformed,
  updateNewMovie,
  online,
  loading,
  totalMovies,
  currentPage,
  updateRateForTask,
  toggleShowSearchOrRating,
  handlePaginationChange,
}) => {
  const getInputSearch = async (text, genres) => {
    if (text.length > 0) {
      try {
        const searchResults = await multy.getMulti(text, currentPage)

        if (searchResults && Array.isArray(searchResults.results)) {
          const moviesWithGenres = searchResults.results.map((movie) => {
            const genre_names = (movie.genre_ids || [])
              .map((id) => genres.find((g) => g.id === id)?.name || null)
              .filter(Boolean)

            return {
              ...movie,
              genre_names,
              rating_star: 0,
            }
          })

          updateNewMovie(moviesWithGenres, true, searchResults.total_results)
        } else {
          updateNewMovie([], false, 0)
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
        updateNewMovie([], false, 0)
      }
    } else {
      updateNewMovie([], false, 0)
    }
  }

  return (
    <GenresConsumer>
      {(genres) => {
        const debouncedSearch = debounce((e) => {
          getInputSearch(e.target.value, genres)
        }, 1000)

        const displayedMovies = newMovie && newMovie.length > 0 ? newMovie : movies

        return (
          <div className="movie-wrapper">
            <Pagination
              showSizeChanger={false}
              defaultCurrent={1}
              pageSize={20}
              total={totalMovies}
              current={currentPage}
              onChange={(value) => handlePaginationChange(value)}
            />
            <Search toggleShowSearchOrRating={toggleShowSearchOrRating} getInputSearch={debouncedSearch} />
            <ul className="movie-list">
              <MovieItem
                vote={vote}
                movies={displayedMovies}
                online={online}
                loading={loading}
                updateRateForTask={updateRateForTask}
                toggleShowSearchOrRating={toggleShowSearchOrRating}
                newMovie={newMovie}
                search={searchPerformed}
              />
            </ul>
          </div>
        )
      }}
    </GenresConsumer>
  )
}

export default MovieList

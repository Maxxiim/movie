import React from 'react'
import { Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieItem from '../movie-item/movie-item.js'
import Search from '../search/search.js'
import './movie-list.css'

const MovieList = ({
  vote,
  movies,
  loading,
  online,
  totalMovies,
  currentPage,
  searchPerformed,
  updateRateForTask,
  toggleShowSearchOrRating,
  handlePaginationChange,
  onSearch,
  handleInputSearch,
}) => {
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value) => {
        onSearch(value, 1)
      }, 800),
    [onSearch]
  )

  React.useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  return (
    <div className="movie-wrapper">
      <Search getInputSearch={handleInputSearch} toggleShowSearchOrRating={toggleShowSearchOrRating} />
      {/* <Search toggleShowSearchOrRating={toggleShowSearchOrRating} getInputSearch={debouncedSearch} /> */}
      <ul className="movie-list">
        <MovieItem
          vote={vote}
          movies={movies}
          online={online}
          loading={loading}
          updateRateForTask={updateRateForTask}
          toggleShowSearchOrRating={toggleShowSearchOrRating}
          search={searchPerformed}
        />
      </ul>
      <Pagination
        showSizeChanger={false}
        pageSize={20}
        total={totalMovies}
        current={currentPage}
        onChange={handlePaginationChange}
      />
    </div>
  )
}

export default MovieList

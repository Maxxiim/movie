import React, { Component } from 'react'

import MovieList from '../movie-list/movie-list.js'

import './app.css'

class App extends Component {
  render() {
    return (
      <div className="container">
        <MovieList />
      </div>
    )
  }
}

export default App

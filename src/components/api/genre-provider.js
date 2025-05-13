import React, { Component } from 'react'

import Genres from './genres.js'
import { GenresProvider } from './genre-context.js'

class GenreProvider extends Component {
  state = {
    genres: [],
  }

  async componentDidMount() {
    const genresApi = new Genres()
    try {
      const genres = await genresApi.getGenres()
      this.setState({ genres })
    } catch (err) {
      console.error('Error fetching genres:', err)
    }
  }

  render() {
    const { genres } = this.state
    return <GenresProvider value={genres}>{this.props.children}</GenresProvider>
  }
}

export default GenreProvider

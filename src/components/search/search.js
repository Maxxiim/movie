import React, { Component } from 'react'

import '../search/search.css'

class Search extends Component {
  render() {
    const { toggleShowSearchOrRating } = this.props
    return (
      <div className="search">
        <div className="search__toggle">
          <button className="btn btn__active  btn__search" onClick={(e) => toggleShowSearchOrRating(e)}>
            Search
          </button>
          <button className="btn btn__rating" onClick={(e) => toggleShowSearchOrRating(e)}>
            Rating
          </button>
        </div>
        <input className="input" onChange={this.props.getInputSearch} placeholder="Type to search..."></input>
      </div>
    )
  }
}

export default Search

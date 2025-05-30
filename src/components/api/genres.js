class Genres {
  async getResourseGenres() {
    try {
      const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NWVhZTNmYzBkNzI1MjQyYjQwOTYzZjc3ODNkODNhMyIsIm5iZiI6MTc0Mzg2MTAyOS45MDgsInN1YiI6IjY3ZjEzNTI1ZWRlOGQ4MmYzYmFkNzEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fA4bKuadJqh9pWQzzzIE47tWsAKw55rBAKLD-y2t7pw',
        },
      }

      const res = await fetch(url, options)
      const data = await res.json()
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  async getGenres() {
    try {
      const res = await this.getResourseGenres()
      const data = res.genres
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default Genres

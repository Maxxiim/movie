class Multy {
  async getMulti(query, page) {
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=true&language=en-US&page=${page}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NWVhZTNmYzBkNzI1MjQyYjQwOTYzZjc3ODNkODNhMyIsIm5iZiI6MTc0Mzg2MTAyOS45MDgsInN1YiI6IjY3ZjEzNTI1ZWRlOGQ4MmYzYmFkNzEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fA4bKuadJqh9pWQzzzIE47tWsAKw55rBAKLD-y2t7pw',
      },
    }

    if (!query) {
      console.warn('Произошла ошибка')
      return { results: [], total_results: 0 }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    return data
  }
}

export default Multy

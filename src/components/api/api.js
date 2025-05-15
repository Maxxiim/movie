import Guest from './guest.js'

class Movie {
  async getResourse(sortOption = 'popularity.desc', page = 1) {
    const sessionId = await new Guest().getGuestId()
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortOption}&guest_session_id=${sessionId}`
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NWVhZTNmYzBkNzI1MjQyYjQwOTYzZjc3ODNkODNhMyIsIm5iZiI6MTc0Mzg2MTAyOS45MDgsInN1YiI6IjY3ZjEzNTI1ZWRlOGQ4MmYzYmFkNzEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fA4bKuadJqh9pWQzzzIE47tWsAKw55rBAKLD-y2t7pw',
        },
      }

      const res = await fetch(url, options)
      if (!res.ok) {
        throw new Error(`${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  async getTotalList() {
    try {
      const res = await this.getResourse()
      const data = res.total_results
      console.log(data)
      return data
    } catch (err) {
      console.log(err)
    }
  }
}

export default Movie

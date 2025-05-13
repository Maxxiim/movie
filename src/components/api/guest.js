class Guest {
  async getGuestId() {
    const existing = localStorage.getItem('guestSessionId')
    if (existing) return existing

    const url = 'https://api.themoviedb.org/3/authentication/guest_session/new'
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
    const sessionId = await data.guest_session_id

    localStorage.setItem('guestSessionId', sessionId)

    return sessionId
  }
}

export default Guest

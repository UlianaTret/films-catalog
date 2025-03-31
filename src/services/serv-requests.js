export default class servRequests {
  _apiBase = 'https://api.themoviedb.org';
  _optionsGET = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWIzNzBjOGE3N2U2Mjg2MmVhMTc1YWY4MDUwNWMyMCIsIm5iZiI6MTczMjE4MjgyMC44NDMwMDAyLCJzdWIiOiI2NzNmMDMyNDQ2NTQxYmJjZDM3OWQ1YzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DHJenxs4SsjTaso_kXBQWwnWAfx385RZdJFG4CodLDI',
    },
  };

  async createGuestSession() {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new', this._optionsGET)
      .then((res) => res.json())
      .then((res) => {
        const {
          // expires_at: expires, //60 minutes
          guest_session_id: sessionId,
          success,
        } = res;
        if (success) {
          // console.log(expires);
          // document.cookie = `guest_session_id=${sessionId};max-age=${expires};secure;path=/`;
          document.cookie = `guest_session_id=${sessionId};max-age=${3600};secure;path=/`;
        }
      });
    // .catch((err) => console.error(err));
  }

  async getResource(url) {
    const resource = this._apiBase + url;

    const answerServer = await fetch(resource, this._optionsGET).then((res) => res.json());
    // .catch((err) => console.error(err));
    return answerServer;
  }

  async getAllMovies(movie, page) {
    const urlFirstPage = '/3/trending/movie/day?language=en-US';
    const url = movie ? `/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=${page}` : urlFirstPage;
    const result = await this.getResource(url);

    if (!result.results) {
      throw new Error(`Запрос несуществующего ресурса ${this._apiBase + url}`);
    }
    return result.results;
  }

  async getGenres() {
    const url = '/3/genre/movie/list?language=en';
    const genres = await this.getResource(url);
    const objGenres = {};
    if (genres.genres) {
      for (let genre of genres.genres) {
        objGenres[genre.id] = genre.name;
      }
    }
    return objGenres;
  }

  async getRatedMovies() {
    const sessionId = getCookie('guest_session_id');

    if (sessionId) {
      const url = `/3/guest_session/${sessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`;
      const result = await this.getResource(url);

      if (!result.results) {
        throw new Error(`Запрос не удалось получить список фильмов с оценкой пользователя ${this._apiBase + url}`);
      }
      return result.results;
    }
    return 'вы не авторизованы';
  }

  async setUserRate(id, rate) {
    const optionsPOST = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWIzNzBjOGE3N2U2Mjg2MmVhMTc1YWY4MDUwNWMyMCIsIm5iZiI6MTczMjE4MjgyMC44NDMwMDAyLCJzdWIiOiI2NzNmMDMyNDQ2NTQxYmJjZDM3OWQ1YzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DHJenxs4SsjTaso_kXBQWwnWAfx385RZdJFG4CodLDI',
      },
      body: JSON.stringify({
        value: rate,
      }),
    };

    const sessionId = getCookie('guest_session_id');

    if (sessionId) {
      const url = `/3/movie/${id}/rating?guest_session_id=${sessionId}`;
      const result = await fetch(this._apiBase + url, optionsPOST)
        .then((res) => res.json())
        .catch((err) => err);

      // console.log(116, result);
      if (!result.success) {
        throw new Error('не удалось поставить оценку фильму');
      }
      return result.success;
    }
    return 'вы не авторизированы';
  }
}

function getCookie(name) {
  let cookie = document.cookie.split(';').find((row) => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

// API Key: 278422daa8469ee049e32446dbb6ca1a

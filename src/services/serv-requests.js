export default class servRequests {
  _apiBase = 'https://api.themoviedb.org';
  _token =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDdlNDcxNmM2NzgzNDU2YzhiNWViNDEyMGY3ZDViYyIsIm5iZiI6MTczMjE4MjgyMC44NDMwMDAyLCJzdWIiOiI2NzNmMDMyNDQ2NTQxYmJjZDM3OWQ1YzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LCiYJcrGULvvE0OJbJMn5NfbLSYBXqzujwVec44M1Wo';

  async getResource(url) {
    const optionsGET = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: this._token,
      },
    };
    const resource = this._apiBase + url;
    const answerServer = await fetch(resource, optionsGET).then((res) => res.json());
    return answerServer;
  }

  async postResource(url, bodyParams) {
    const optionsPOST = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this._token,
      },
      body: bodyParams,
    };

    const resource = this._apiBase + url;
    const answerServer = await fetch(resource, optionsPOST).then((res) => res.json());
    return answerServer;
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

  async createGuestSession() {
    const url = '/3/authentication/guest_session/new';
    const result = await this.getResource(url);
    if (result.success) {
      const { expires_at: expires, guest_session_id: sessionId } = result;
      document.cookie = `guest_session_id=${sessionId};max-age=${expires};secure;path=/`;
    } else throw new Error('Перезагрузите страницу');
  }

  async getAllMovies(movie, page) {
    const urlFirstPage = '/3/trending/movie/day?language=en-US';
    const url = movie ? `/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=${page}` : urlFirstPage;
    const result = await this.getResource(url);

    if (!result.results) {
      throw new Error(`Запрос несуществующего ресурса ${this._apiBase + url}`);
    }
    return result;
  }

  async getRatedMovies() {
    const sessionId = getCookie('guest_session_id');

    if (sessionId) {
      const url = `/3/guest_session/${getCookie('guest_session_id')}/rated/movies?language=en-US`;
      const result = await this.getResource(url);
      if (!result.results || !result.success) {
        throw new Error(`Не удалось получить список фильмов с оценкой пользователя ${this._apiBase + url}`);
      }
      return result.results;
    } else throw new Error('Вы не авторизованы');
  }

  async setUserRate(id, rate) {
    const sessionId = getCookie('guest_session_id');

    if (sessionId) {
      const url = `/3/movie/${id}/rating?guest_session_id=${sessionId}`;
      const bodyParams = JSON.stringify({
        value: rate,
      });

      const result = await this.postResource(url, bodyParams);
      if (!result.success) {
        throw new Error('не удалось поставить оценку фильму');
      }
      return result.success;
    }
    return 'Вы не авторизированы';
  }
}

function getCookie(name) {
  let cookie = document.cookie.split(';').find((row) => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

import React from 'react';

import './app.css';
import MainContent from '../main-content';
// import Footer from '../footer';
import servRequests from '../../services/serv-requests';
import { GenreProvider } from '../../contexts/index';

export default class App extends React.Component {
  dataService = new servRequests();
  genres = null;
  state = {
    // findMovie: 'wicked',
    findMovie: null,
    page: 1,
    movies: null,
    loading: true,
    error: false,
    globalError: false, //для vpn
    ratedMovies: null,
    loadingRateds: true,
    errorRateds: false,
  };

  componentDidMount() {
    this.getData();
    this.getRatedMovies();
    this.getGenresMovies();

    //гостевая сессия по api
    this.dataService.createGuestSession();
  }

  componentDidCatch(error, errorInfo) {
    console.log(25, error, errorInfo);
    this.setState({ globalError: true });
  }

  getCatalogMovies() {
    const { findMovie, page } = this.state;
    this.dataService
      .getAllMovies(findMovie, page)
      .then((result) => {
        this.setState({
          movies: Array.from(result),
          loading: false,
          error: false,
        });
      })
      .catch((reason) => {
        console.log('произошла ошибка', reason); //, error);
        this.setState(() => {
          return {
            error: true,
            loading: false,
          };
        });
      });
  }

  getData() {
    // if (!this.state.movies) return;
    this.setState(() => {
      return {
        loading: true,
      };
    });
    this.getCatalogMovies();
  }

  getGenresMovies() {
    this.dataService
      .getGenres()
      .then((result) => {
        this.genres = result;
      })
      .catch((reason) => {
        console.log('жанры не найдены', reason);
        this.genres = null;
      });
  }

  getRatedMovies() {
    // const { findMovie, page } = this.state;
    this.dataService
      .getRatedMovies()
      .then((result) => {
        this.setState({
          ratedMovies: Array.from(result),
          loadingRateds: false,
          errorRateds: false,
        });
      })
      .catch((reason) => {
        console.log('произошла ошибка', reason); //, error);
        this.setState(() => {
          return {
            loadingRateds: false,
            errorRateds: true,
          };
        });
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('fn update APP', prevProps, prevState, snapshot);
    if (prevState.findMovie !== this.state.findMovie) {
      console.log('отпрвить запрос на новй каталог');
      this.getData();
    }

    if (prevState.page !== this.state.page) {
      console.log('отпрвить запрос на новй каталог');
      this.getData();
    }
    // запрашиваю новый каталог
    // console.log(this.state.movies);
  }

  updateCatalog = (movie) => {
    console.log('запрос нового каталога в App', movie);
    this.setState({
      findMovie: movie,
    });
  };

  updatePage = (page) => {
    console.log('update page app', page);
    this.setState({
      page: page,
    });
  };

  setUserRate = (id, rate) => {
    console.log('setUserRate id=', id, 'rate=', rate);
    this.dataService
      .setUserRate(id, rate)
      .then((result) => {
        console.log('результат оценки фильма: ', result);
        if (result) {
          console.log('app.js setUserRate: вывести Alert, обновить список фильмов с оценкой');
          this.getRatedMovies();
        }
      })
      .catch((reason) => {
        console.log('произошла ошибка: ', reason);
      });
  };
  render() {
    console.log('render app', this.state);
    if (this.state.globalError) console.log('вернуть экран ошибки');
    return (
      <div className="app">
        <GenreProvider value={this.genres}>
          <MainContent
            data={this.state}
            updateCatalog={this.updateCatalog}
            setUserRate={this.setUserRate}
            updatePage={this.updatePage}
          />
        </GenreProvider>
      </div>
    );
  }
}

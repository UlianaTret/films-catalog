import React from 'react';
import { Alert } from 'antd';

import servRequests from '../../services/serv-requests';
import { GenreProvider } from '../../contexts/index';
import MainContent from '../main-content';

import './app.css';

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
    globalError: false,
    ratedMovies: null,
    loadingRateds: true,
    errorRateds: false,
  };

  componentDidMount() {
    //гостевая сессия по api
    this.dataService.createGuestSession();
    this.getGenresMovies();
    this.getData();
    this.getRatedMovies();
  }

  // componentDidCatch(error, errorInfo) {
  //   console.log(25, error, errorInfo);
  //   this.setState({ globalError: true });
  // }
  componentDidCatch() {
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
        console.log('произошла ошибка', reason);
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
        console.log('произошла ошибка', reason);
        this.setState(() => {
          return {
            loadingRateds: false,
            errorRateds: true,
          };
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.findMovie !== this.state.findMovie) {
      this.getData();
    }

    if (prevState.page !== this.state.page) {
      this.getData();
    }
  }

  updateCatalog = (movie) => {
    this.setState({
      findMovie: movie,
    });
    this.updatePage(1);
  };

  updatePage = (page) => {
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
    if (this.state.globalError) return <Alert message={'This service is not available in your country.'} type="info" />;
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

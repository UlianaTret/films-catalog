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
    findMovie: null,
    page: 1,
    totalPages: null,
    movies: null,
    loading: true,
    error: false,
    globalError: false,
    ratedMovies: [],
    loadingRateds: true,
    errorRateds: true,
  };

  componentDidMount() {
    this.dataService.createGuestSession();
    this.getGenresMovies();
    this.getData();
  }

  componentDidCatch() {
    this.setState({ globalError: true });
  }

  getCatalogMovies() {
    const { findMovie, page } = this.state;
    this.dataService
      .getAllMovies(findMovie, page)
      .then((result) => {
        this.setState({
          movies: Array.from(result.results),
          totalPages: result.total_pages,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        this.setState(() => {
          return {
            error: true,
            loading: false,
          };
        });
      });
  }

  getData() {
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
      .catch(() => {
        this.genres = null;
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

  setUserRate = (movie) => {
    this.setState({
      ratedMovies: [...this.state.ratedMovies, movie],
      errorRateds: false,
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

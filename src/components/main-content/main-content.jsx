import React from 'react';
import { debounce } from 'lodash';
import { Spin, Alert, Pagination } from 'antd';

import MovieCard from '../movie-card';
import './main-content.css';
import './tabs.css';

export default class MainContent extends React.Component {
  state = {
    movie: '',
  };

  findMovie() {
    if (!this.state.movie) return;
    this.props.updateCatalog(this.state.movie);
  }

  delayFindMovie = debounce(this.findMovie, 2000, {
    leading: false,
    maxWait: 2500,
    trailing: true,
  });

  onLabelChange = (e) => {
    console.log('onLableChange', e.target.value);
    this.setState({
      movie: e.target.value,
    });
    this.delayFindMovie();
  };
  ////////////////////////////////////////////

  addUserRate(movie, ratedMovies) {
    if (ratedMovies) {
      ratedMovies.forEach((ratedMovie) => {
        if (ratedMovie.id === movie.id) movie.rating = ratedMovie.rating;
      });
    }
    return movie;
  }

  render() {
    const { movies, ratedMovies, findMovie, loading, error } = this.props.data;

    const spinner = loading ? <Spin className="spin-loader" /> : null;
    const errorMassage = error ? <Alert message="ЧТО-ТО ПОШЛО НЕ ТАК :((" type="error" /> : null; //создадть компонент ошибки

    let content = null;
    if (!(loading || error)) {
      if (movies.length === 0) {
        const messageUser = `По запросу '${findMovie}' ничего не найдено :((`;
        content = <Alert message={messageUser} type="info" />;
      } else {
        content = movies.map((movie) => {
          return (
            <MovieCard
              movie={this.addUserRate(movie, ratedMovies)}
              key={movie.id}
              setUserRate={this.props.setUserRate}
            />
          );
        });
      }
    }

    const ratedMoviesList = ratedMovies ? (
      ratedMovies.map((movie) => <MovieCard movie={movie} key={movie.id} setUserRate={this.props.setUserRate} />)
    ) : (
      <Alert message="Начните оценивать фильмы" />
    );

    return (
      <div className="content">
        <div className="tab">
          <input checked id="tab-btn-1" name="tab-btn" type="radio" value="" />
          <label htmlFor="tab-btn-1">Search</label>
          <input id="tab-btn-2" name="tab-btn" type="radio" value="" />
          <label htmlFor="tab-btn-2">Rated</label>

          <div className="tab-content" id="content-1">
            <input
              className="search-movie"
              type="text"
              placeholder="Type to search..."
              autoFocus
              value={this.state.movie}
              onChange={this.onLabelChange}
            />
            <div className="catalog">
              {spinner}
              {errorMassage}
              {content}
            </div>
            <Pagination current={this.props.data.page} onChange={this.props.updatePage} total={50} />
          </div>

          <div className="tab-content" id="content-2">
            <div className="content">
              {spinner}
              {/*{errorMassage}*/}
              {ratedMoviesList}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

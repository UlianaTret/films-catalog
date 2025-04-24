import React from 'react';
import './movie-card.css';
import { Rate } from 'antd';

import GenreList from '../genre-list';

function cuttingDescription(text) {
  const str1 =
    'A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high';

  const maxLength = str1.length - 50;
  if (text.length === 0) return 'Описание отсутсвует';
  if (text.length <= maxLength) return text;
  let trimmedString = text.substring(0, maxLength);
  trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  if (trimmedString[trimmedString.length - 1] === ',') {
    return trimmedString.slice(0, -1) + '...';
  }
  return trimmedString + '...';
}

function cuttingName(text) {
  if (text.length <= 18) return text;
  let trimmedString = text.substring(0, 18);
  trimmedString = trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  if (trimmedString[trimmedString.length - 1] === ',') {
    return trimmedString.slice(0, -1) + '...';
  }
  return trimmedString + '...';
}

export default class MovieCard extends React.Component {
  constructor(props) {
    super(props);
  }

  formatDate(strDate) {
    const date = new Date(strDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleString('en-US', options);
  }

  render() {
    const apiBase = 'https://image.tmdb.org/t/p/original';
    const {
      id,
      title: name,
      vote_average: vote,
      poster_path: poster,
      release_date: release,
      genre_ids: genre,
      overview: description,
      rating,
    } = this.props.movie;
    const colorRate = vote < 5 ? (vote < 3 ? '#E90000' : '#E97E00') : vote >= 7 ? '#66E900' : '#E9D100';

    return (
      <div className="card">
        <img className="movie-poster" src={apiBase + poster} alt={'Постер фильма ' + name} />
        <div>
          <div className="general-info">
            <img className="movie-poster-mini" src={apiBase + poster} alt={'Постер фильма ' + name} />
            <div>
              <div>
                <p className="name">
                  <abbr title={name}>{cuttingName(name)}</abbr>
                </p>
                <p
                  className="rating"
                  aria-label={'рейтинг фильма ' + name}
                  style={{
                    border: `${colorRate} solid 2px`,
                  }}
                >
                  {vote.toFixed(1)}
                </p>
              </div>
              <p className="release-date">{this.formatDate(release)}</p>
              <GenreList genres={genre} />
            </div>
          </div>
          <p className="description">{cuttingDescription(description)}</p>
          <Rate
            count={10}
            defaultValue={rating ? rating : 0}
            onChange={(value) => {
              this.props.setUserRate({
                id: id,
                title: name,
                vote_average: vote,
                poster_path: poster,
                release_date: release,
                genre_ids: genre,
                overview: description,
                rating: value,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

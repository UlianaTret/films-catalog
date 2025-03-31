import React from 'react';
import './genre-list.css';

import { GenreConsumer } from '../../contexts/index';

const GenreList = (props) => {
  return (
    <GenreConsumer>
      {(genres) => {
        return (
          <li>
            {props.genres.map((id) => (
              <ul key={id}>
                <span className="genre">{genres[id]}</span>
              </ul>
            ))}
          </li>
        );
      }}
    </GenreConsumer>
  );
};

export default GenreList;

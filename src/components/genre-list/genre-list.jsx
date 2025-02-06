import React from "react";
import "./genre-list.css";

const GenreList = (props) => {
    console.log(props)
    return (
        <li>
            {props.genres.map(
                genre => <ul><span className="genre">{genre}</span></ul>
            )}
            <ul><span className="genre">Action</span></ul>
            <ul><span className="genre">Drama</span></ul>
            <ul><span className="genre">Comedy</span></ul>
            <ul><span className="genre">Action</span></ul>
            <ul><span className="genre">Drama</span></ul>
            <ul><span className="genre">Comedy</span></ul>
        </li>
    )
};

export default GenreList;
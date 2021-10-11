import React, { useState } from 'react';
import { post } from './Fetch';
import { ToastContainer, toast } from 'react-toastify';
import { MovieResponse, Movie } from './Movies'
import 'react-toastify/dist/ReactToastify.css';

const MovieInput = () => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(9.7);
    const [times, setTime] = useState(["12:45"]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); {
            const newMovie: Movie = {
                name: name,
                rating: rating,
                time: times
            };

            post<MovieResponse>("http://localhost:3000/api/movie", {}, JSON.stringify(newMovie)).then(response => {
                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            });
        };
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Name: <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} /></label>
            <label>Rating: <input type="number" name="rating" min="1" max="10" step="0.1" value={rating} onChange={e => setRating(parseFloat(e.target.value))} /></label>
            <label>Showtime: <input type="time" name="time" value={times[0]} onChange={e => setTime([e.target.value])} /></label>
            <input type="submit" value="Add movie"></input>
            <ToastContainer />
        </form>
    );
};

export default MovieInput;
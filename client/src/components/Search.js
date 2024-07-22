import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Search() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Navigating to:', `/inventory/${input}`); // Debugging line
        navigate(`/inventory/${input}`);
    };

    return (
        <div className='searchBar'>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} placeholder="Search" onChange={(e) => setInput(e.target.value)} />
                <input type="submit" />
            </form>
        </div>  
    );
}

export default Search;

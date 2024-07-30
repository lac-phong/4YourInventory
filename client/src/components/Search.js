import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Search() {
    const [input, setInput] = useState("");
    const [searchType, setSearchType] = useState("part_number");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchType === "part_number") {
            console.log('Navigating to:', `/inventory/${input}`);
            navigate(`/inventory/${input}`);
        } else if (searchType === "serial_number") {
            console.log('Navigating to:', `/serials/${input}`);
            navigate(`/serials/${input}`);
        }
    };

    return (
        <div className='container mt-4'>
            <form onSubmit={handleSubmit} className='d-flex'>
                <select 
                    className='form-select me-2'
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ maxWidth: '200px', backgroundColor: '#eafaf1', color: '#333' }}
                >
                    <option value="part_number">Part Number</option>
                    <option value="serial_number">Serial Number</option>
                </select>
                <input 
                    type="text" 
                    className='form-control me-2'
                    value={input} 
                    placeholder="Search" 
                    onChange={(e) => setInput(e.target.value)} 
                    style={{ backgroundColor: '#eafaf1', color: '#333' }}
                />
                <button type="submit" className='btn btn-success'>
                    Search
                </button>
            </form>
        </div>
    );
}

export default Search;

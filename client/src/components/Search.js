import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Search() {
    const [input, setInput] = useState("");
    const [searchType, setSearchType] = useState("part_number");
    const navigate = useNavigate();

    // Retrieve the searchType from sessionStorage when the component mounts
    useEffect(() => {
        const savedSearchType = sessionStorage.getItem("searchType");
        if (savedSearchType) {
            setSearchType(savedSearchType);
        }
    }, []);

    // Update searchType and save it to sessionStorage
    const handleSearchTypeChange = (e) => {
        const value = e.target.value;
        setSearchType(value);
        sessionStorage.setItem("searchType", value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchType === "part_number") {
            navigate(`/inventory/${input}`);
        } else if (searchType === "serial_number") {
            navigate(`/serials/${input}`);
        } else if (searchType === "manufacturer") {
            navigate(`/parts/manufacturer/${input}`);
        } else if (searchType === "category") {
            navigate(`/parts/category/${input}`);
        }
    };

    return (
        <div className='container mt-4'>
            <form onSubmit={handleSubmit} className='d-flex'>
                <select 
                    className='form-select me-2'
                    value={searchType} 
                    onChange={handleSearchTypeChange}
                    style={{ maxWidth: '200px', backgroundColor: '#eafaf1', color: '#333' }}
                >
                    <option value="part_number">Part Number</option>
                    <option value="serial_number">Serial Number</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="category">Category</option>
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

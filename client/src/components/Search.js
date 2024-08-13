import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryDropdown from '../components/CategoryDropdown';
import ManufacturerDropdown from '../components/ManufacturerDropdown'; // Import the new component
import '../styles/Search.css';
import axios from 'axios';
import BannerImage from "../assets/homeBack.png";

function Search() {
    const [input, setInput] = useState("");
    const [searchType, setSearchType] = useState("part_number");
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]); // State to hold manufacturers
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedSearchType = sessionStorage.getItem("searchType");
        if (savedSearchType) {
            setSearchType(savedSearchType);
        }

        // Fetch categories and manufacturers on component mount
        const fetchData = async () => {
            try {
                const [categoriesResponse, manufacturersResponse] = await Promise.all([
                    axios.get('http://localhost:8080/categories'),
                    axios.get('http://localhost:8080/manufacturers')
                ]);
                setCategories(categoriesResponse.data);
                setManufacturers(manufacturersResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchTypeChange = (e) => {
        const value = e.target.value;
        setSearchType(value);
        sessionStorage.setItem("searchType", value);
    };

    const sanitizeInput = (input) => {
        return input.replace(/['"<>#]/g, '');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const sanitizedInput = sanitizeInput(input.trim());
        if (!sanitizedInput) {
            return;
        }

        const encodedInput = encodeURIComponent(sanitizedInput);

        switch (searchType) {
            case "part_number":
                navigate(`/inventory/${encodedInput}`);
                break;
            case "serial_number":
                navigate(`/serials/${encodedInput}`);
                break;
            case "manufacturer":
                navigate(`/parts/manufacturer/${encodedInput}`);
                break;
            case "category":
                navigate(`/parts/category/${encodedInput}`);
                break;
            default:
                console.error("Invalid search type");
        }
    };

    const handleDelete = async () => {
        if (!input) {
            console.error(`No ${searchType} selected for deletion`);
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to delete the ${searchType} "${input}"?`);
        if (!confirmed) {
            return;
        }

        try {
            const url = searchType === "category" ? 'http://localhost:8080/categories' : 'http://localhost:8080/manufacturers';
            await axios.delete(url, {
                data: { [searchType]: input }
            });

            if (searchType === "category") {
                setCategories(categories.filter(cat => cat !== input));
            } else {
                setManufacturers(manufacturers.filter(manufacturer => manufacturer !== input));
            }

            setInput("");
            alert(`${searchType.charAt(0).toUpperCase() + searchType.slice(1)} deleted successfully`);
            setIsEditing(false);
        } catch (error) {
            console.error(`Failed to delete ${searchType}:`, error);
            alert(`Failed to delete ${searchType}`);
        }
    };

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className='container mt-4'>
            <div className='imageCont'>
                <img src={BannerImage} alt="Logo" />
            </div>
            <form onSubmit={handleSubmit} className='d-flex flex-column'>
                <div className='d-flex align-items-center mb-3'>
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
                    {searchType === "category" ? (
                        <>
                            <CategoryDropdown 
                                selectedCategory={input}
                                onChange={(e) => setInput(e.target.value)}
                                categories={categories} 
                                className="green-bg"
                            />
                            {!isEditing && (
                                <button 
                                    type="button" 
                                    className='btn btn-primary ms-2 btn-lg'
                                    onClick={handleToggleEdit}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Edit
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button 
                                        type="button" 
                                        className='btn btn-danger ms-2 btn-lg'
                                        onClick={handleDelete}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        type="button" 
                                        className='btn btn-secondary ms-2 btn-lg'
                                        onClick={handleToggleEdit}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </>
                    ) : searchType === "manufacturer" ? (
                        <>
                            <ManufacturerDropdown 
                                selectedManufacturer={input}
                                onChange={(e) => setInput(e.target.value)}
                                manufacturers={manufacturers} 
                                className="green-bg"
                            />
                            {!isEditing && (
                                <button 
                                    type="button" 
                                    className='btn btn-primary ms-2 btn-lg'
                                    onClick={handleToggleEdit}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Edit
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button 
                                        type="button" 
                                        className='btn btn-danger ms-2 btn-lg'
                                        onClick={handleDelete}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        type="button" 
                                        className='btn btn-secondary ms-2 btn-lg'
                                        onClick={handleToggleEdit}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <input 
                            type="text" 
                            className='form-control me-2 green-bg'
                            value={input} 
                            placeholder="Search" 
                            onChange={(e) => setInput(e.target.value)} 
                        />
                    )}
                </div>
                <button type="submit" className='btn btn-success'>
                    Search
                </button>
            </form>
        </div>
    );
}

export default Search;

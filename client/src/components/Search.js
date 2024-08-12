import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryDropdown from '../components/CategoryDropdown'; // Adjust the import path as necessary
import '../styles/Search.css'; // Import the CSS file for styles
import axios from 'axios'; // Import axios for API calls
import BannerImage from "../assets/homeBack.png";

function Search() {
    const [input, setInput] = useState("");
    const [searchType, setSearchType] = useState("part_number");
    const [categories, setCategories] = useState([]); // State to hold categories
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false); // State for edit mode

    useEffect(() => {
        const savedSearchType = sessionStorage.getItem("searchType");
        if (savedSearchType) {
            setSearchType(savedSearchType);
        }
        
        // Fetch categories on component mount
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories'); // Adjust the URL as needed
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        
        fetchCategories();
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

    const handleDeleteCategory = async () => {
        if (!input) {
            console.error('No category selected for deletion');
            return;
        }

        // Confirm deletion
        const confirmed = window.confirm(`Are you sure you want to delete the category "${input}"?`);
        if (!confirmed) {
            return; // Stop execution if not confirmed
        }

        try {
            await axios.delete('http://localhost:8080/categories', {
                data: { category: input }
            });
            setCategories(categories.filter(cat => cat !== input));
            setInput(""); // Clear the input after deletion
            alert('Category deleted successfully');
            setIsEditing(false); // Reset edit mode after deletion
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category');
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
                                className="green-bg" // Add a class to style the dropdown
                            />
                            {!isEditing && (
                                <button 
                                    type="button" 
                                    className='btn btn-primary ms-2 btn-lg'
                                    onClick={handleToggleEdit}
                                    style={{ marginLeft: 'auto' }} // Push button to the right
                                >
                                    Edit
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button 
                                        type="button" 
                                        className='btn btn-danger ms-2 btn-lg'
                                        onClick={handleDeleteCategory}
                                        style={{ marginLeft: 'auto' }} // Push button to the right
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        type="button" 
                                        className='btn btn-secondary ms-2 btn-lg'
                                        onClick={handleToggleEdit}
                                        style={{ marginLeft: 'auto' }} // Push button to the right
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

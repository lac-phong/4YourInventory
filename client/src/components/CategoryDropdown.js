import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryDropdown = ({ selectedCategory, onChange, className }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <select 
            value={selectedCategory} 
            onChange={onChange}
            className={`form-select me-2 ${className}`}
        >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
            ))}
        </select>
    );
};

export default CategoryDropdown;

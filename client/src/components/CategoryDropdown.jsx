import React, { useState, useEffect } from 'react';

const CategoryDropdown = ({ selectedCategory, onChange, className }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await window.electron.ipcRenderer.invoke('get-all-categories');
                setCategories(response);
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

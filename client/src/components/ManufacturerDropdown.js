import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManufacturerDropdown = ({ selectedManufacturer, onChange, className }) => {
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/manufacturers');
                setManufacturers(response.data);
            } catch (error) {
                console.error('Error fetching manufacturers:', error);
            }
        };

        fetchManufacturers();
    }, []);

    return (
        <select 
            value={selectedManufacturer} 
            onChange={onChange}
            className={`form-select me-2 ${className}`}
        >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer, index) => (
                <option key={index} value={manufacturer}>{manufacturer}</option>
            ))}
        </select>
    );
};

export default ManufacturerDropdown;

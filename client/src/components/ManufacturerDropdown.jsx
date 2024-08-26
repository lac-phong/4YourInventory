import React, { useState, useEffect } from 'react';

const ManufacturerDropdown = ({ selectedManufacturer, onChange, className }) => {
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await window.electron.ipcRenderer.invoke('get-all-manufacturers');
                setManufacturers(response);
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

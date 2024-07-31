import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Search from '../components/Search';
import '../styles/Inventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SerialNumber() {
    const { serialNumber } = useParams(); // Change here
    const [serial, setSerial] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        serial_number: '',
        part_number: '',
        sold: false,
        locations: '',
        item_condition: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (serialNumber) {
            getSerialNumber(serialNumber);
        }
    }, [serialNumber]);

    const getSerialNumber = async (serialNumber) => {
        try {
            const response = await axios.get(`http://localhost:8080/serials/${serialNumber}`);
            console.log("Frontend received data:", response.data); // Log the data
            setSerial(response.data);
            setFormData({
                serial_number: response.data.serial_number,
                part_number: response.data.part_number,
                sold: response.data.sold === 1, // Ensure boolean interpretation
                locations: response.data.locations,
                item_condition: response.data.item_condition,
            });
        } catch (error) {
            console.error('Error fetching serial data:', error);
            setError('No serial data found.');
            setSerial(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/serials/${formData.serial_number}`, formData);
            setSerial(response.data);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating serial data:', error);
        }
    };

    return (
        <div className='inventory container mt-4'>
            <Search />
            {error ? (
                <p>{error}</p>
            ) : serial ? (
                <div>
                    <h3>Serial Number Details</h3>
                    <form onSubmit={handleFormSubmit} className='mb-4'>
                        <table className='table table-striped'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Serial Number</th>
                                    <th>Part Number</th>
                                    <th>Sold</th>
                                    <th>Locations</th>
                                    <th>Item Condition</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='serial_number'
                                                className='form-control'
                                                value={formData.serial_number}
                                                onChange={handleInputChange}
                                                readOnly
                                            />
                                        ) : (
                                            serial.serial_number
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='part_number'
                                                className='form-control'
                                                value={formData.part_number}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            serial.part_number
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='checkbox'
                                                name='sold'
                                                checked={formData.sold}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            serial.sold ? 'Yes' : 'No'
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='locations'
                                                className='form-control'
                                                value={formData.locations}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            serial.locations
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='item_condition'
                                                className='form-control'
                                                value={formData.item_condition}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            serial.item_condition
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <div>
                                                <button type='submit' className='btn btn-primary'>Save</button>
                                                <button type='button' className='btn btn-secondary ml-2' onClick={() => setEditMode(false)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button className='btn btn-warning' onClick={() => setEditMode(true)}>Edit</button>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            ) : (
                <p>No serial data found.</p>
            )}
        </div>
    );
}

export default SerialNumber;
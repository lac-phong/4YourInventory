import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Search from '../components/Search';
import '../styles/Inventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Inventory() {
    const { partNumber } = useParams();
    const [part, setPart] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        part_number: '',
        quantity: '',
        quantity_on_ebay: '', // Ensure this field is included
        quantity_sold: '',
        locations: '',
    });

    useEffect(() => {
        if (partNumber) {
            getPartNumber(partNumber);
        }
    }, [partNumber]);

    const getPartNumber = async (partNumber) => {
        try {
            const response = await axios.get(`http://localhost:8080/parts/${partNumber}`);
            setPart(response.data);
            setFormData({
                part_number: response.data.part_number,
                quantity: response.data.quantity,
                quantity_on_ebay: response.data.quantity_on_ebay, // Ensure this field is set
                quantity_sold: response.data.quantity_sold,
                locations: response.data.locations,
            });
        } catch (error) {
            console.error('Error fetching part data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/parts/${part.id}`, formData);
            setPart(response.data);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating part data:', error);
        }
    };

    return (
        <div className='inventory container mt-4'>
            <Search />
            {part ? (
                <div>
                    <form onSubmit={handleFormSubmit} className='mb-4'>
                        <table className='table table-striped'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>ID</th>
                                    <th>Part Number</th>
                                    <th>Quantity</th>
                                    <th>Quantity Sold</th>
                                    <th>Quantity on eBay</th> {/* Added new column */}
                                    <th>Locations</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={part.id}>
                                    <td>{part.id}</td>
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
                                            part.part_number
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='number'
                                                name='quantity'
                                                className='form-control'
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.quantity
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='number'
                                                name='quantity_sold'
                                                className='form-control'
                                                value={formData.quantity_sold}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.quantity_sold
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='number'
                                                name='quantity_on_ebay'
                                                className='form-control'
                                                value={formData.quantity_on_ebay}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.quantity_on_ebay
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
                                            part.locations
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
                <p>No part data found.</p>
            )}
        </div>
    );
}

export default Inventory;

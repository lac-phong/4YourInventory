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
        quantity_on_ebay: '',
        quantity_sold: '',
        item_description: '', // Ensure this field is included
        category: '', // Ensure this field is included
        manufacturer: '', // Ensure this field is included
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
                quantity_on_ebay: response.data.quantity_on_ebay,
                quantity_sold: response.data.quantity_sold,
                item_description: response.data.item_description, // Ensure this field is set
                category: response.data.category, // Ensure this field is set
                manufacturer: response.data.manufacturer, // Ensure this field is set
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
            const response = await axios.put(`http://localhost:8080/parts/${formData.part_number}`, formData);
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
                                    <th>Part Number</th>
                                    <th>Quantity</th>
                                    <th>Quantity Sold</th>
                                    <th>Quantity on eBay</th>
                                    <th>Item Description</th>
                                    <th>Category</th>
                                    <th>Manufacturer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={part.part_number}>
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
                                                name='item_description'
                                                className='form-control'
                                                value={formData.item_description}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.item_description
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='category'
                                                className='form-control'
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.category
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type='text'
                                                name='manufacturer'
                                                className='form-control'
                                                value={formData.manufacturer}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            part.manufacturer
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

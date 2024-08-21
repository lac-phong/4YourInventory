import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Search from '../components/Search';
import '../styles/Inventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Inventory() {
    const { partNumber } = useParams();
    const [part, setPart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [filter, setFilter] = useState('All'); // Filter state
    const [formData, setFormData] = useState({
        part_number: '',
        quantity: '',
        quantity_on_ebay: '',
        quantity_sold: '',
        item_description: '',
        category: '',
        manufacturer: '',
    });
    const [ebayListings, setEbayListings] = useState({ items: [] });

    useEffect(() => {
        if (partNumber) {
            getPartNumber(partNumber);
        }
    }, [partNumber]);

    const getPartNumber = async (partNumber) => {
    try {
        setLoading(true);
        // Encode the part number to handle special characters
        const encodedPartNumber = encodeURIComponent(partNumber);
        
        const response = await axios.get(`http://localhost:8080/parts/${encodedPartNumber}`);
        const ebayResponse = await axios.get(`http://localhost:8080/item/${encodedPartNumber}`);
        setEbayListings(ebayResponse);

        if (response.data.quantity_on_ebay === ebayResponse.data.totalQuantity) {
            const updatedFormData = {
                part_number: response.data.part_number,
                quantity: response.data.quantity,
                quantity_on_ebay: response.data.quantity_on_ebay,
                quantity_sold: response.data.quantity_sold,
                item_description: response.data.item_description,
                category: response.data.category,
                manufacturer: response.data.manufacturer,
            };
            
            setFormData(updatedFormData);
            setPart(response.data);
        } else {
            const updatedFormData = {
                part_number: response.data.part_number,
                quantity: response.data.quantity,
                quantity_on_ebay: ebayResponse.data.totalQuantity,
                quantity_sold: response.data.quantity_sold,
                item_description: response.data.item_description,
                category: response.data.category,
                manufacturer: response.data.manufacturer,
            };
            
            setFormData(updatedFormData);
            // Update the part with the fetched form data
            const updatedResponse = await axios.put(`http://localhost:8080/parts/${encodedPartNumber}`, updatedFormData);
            // Set the part state with the updated data
            setPart(updatedResponse.data);
        }
      
    } catch (error) {
        console.error('Error fetching part data:', error);
    } finally {
        setLoading(false);
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

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredSerials = part?.serials?.filter(serial => {
        if (filter === 'All') return true;
        if (filter === 'Sold') return serial.sold === 1;
        if (filter === 'Not Sold') return serial.sold === 0;
        return true;
    }) || [];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'green'
            }}>
                <div className="spinner-border" role="status" style={{ marginRight: '10px' }}>
                    <span className="sr-only">Loading...</span>
                </div>
                LOADING
            </div>
        );
    }
    
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
                    <div className='mt-4'>
                        <h3>eBay Listings</h3>
                        <table className='table table-striped'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Condition</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                            {ebayListings.data.items.map((item, index) => {
                                console.log(item); // Check the structure of each item
                                return (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>${item.price.value}</td>
                                        <td>{item.condition}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='filter'>Filter by Sold Status: </label>
                        <select id='filter' className='form-control' value={filter} onChange={handleFilterChange}>
                            <option value='All'>All</option>
                            <option value='Sold'>Sold</option>
                            <option value='Not Sold'>Not Sold</option>
                        </select>
                    </div>
                    {filteredSerials.length > 0 ? (
                        <div>
                            <h3>Serial Numbers</h3>
                            <table className='table table-striped'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>Serial Number</th>
                                        <th>Sold</th>
                                        <th>Locations</th>
                                        <th>Item Condition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSerials.map((serial) => (
                                        <tr key={serial.serial_id}>
                                            <td>{
                                                <Link to={`/serials/${encodeURIComponent(serial.serial_number)}`}>
                                                    {serial.serial_number}
                                                </Link>
                                            }</td>
                                            <td>{serial.sold === 1 ? 'Yes' : 'No'}</td>
                                            <td>{serial.locations}</td>
                                            <td>{serial.item_condition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No serials found for the selected filter.</p>
                    )}
                </div>
            ) : (
                <p>No part data found.</p>
            )}
        </div>
    );
}

export default Inventory;

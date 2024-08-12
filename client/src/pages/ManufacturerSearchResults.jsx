import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from '../components/Search';
import CategoryDropdown from '../components/CategoryDropdown'; // Adjust the import path as necessary

function ManufacturerSearchResults() {
    const { manufacturer } = useParams();
    const [parts, setParts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch parts by manufacturer
    useEffect(() => {
        axios.get(`http://localhost:8080/parts/manufacturer/${manufacturer}`)
            .then(response => {
                setParts(response.data);
            })
            .catch(error => {
                console.error('Error fetching parts:', error);
            });
    }, [manufacturer]);

    // Fetch categories for the dropdown
    useEffect(() => {
        axios.get('http://localhost:8080/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    // Filter parts based on selected category
    const filteredParts = selectedCategory === 'All'
        ? parts
        : parts.filter(part => part.category === selectedCategory);

    return (
        <div className='container mt-4'>
            <Search />  {/* Include the Search component */}
            <br></br>
            <br></br>
            <h2>Search Results for Manufacturer: {manufacturer}</h2>

            <div className="form-group">
                <label htmlFor="categorySelect">Filter by Category:</label>
                <CategoryDropdown 
                    selectedCategory={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-control"
                />
            </div>

            <table className='table table-striped mt-4'>
                <thead>
                    <tr>
                        <th>Part Number</th>
                        <th>Quantity</th>
                        <th>Quantity on eBay</th>
                        <th>Quantity Sold</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredParts.map(part => (
                        <tr key={part.part_number}>
                            <td>{part.part_number}</td>
                            <td>{part.quantity}</td>
                            <td>{part.quantity_on_ebay}</td>
                            <td>{part.quantity_sold}</td>
                            <td>{part.item_description}</td>
                            <td>{part.category}</td>
                            <td>{part.manufacturer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManufacturerSearchResults;

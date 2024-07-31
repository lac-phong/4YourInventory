import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from '../components/Search';

function CategorySearchResults() {
    const { category } = useParams();
    const [parts, setParts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/parts/category/${category}`)
            .then(response => {
                setParts(response.data);
            })
            .catch(error => {
                console.error('Error fetching parts:', error);
            });
    }, [category]);

    return (
        <div className='container mt-4'>
            <Search />  {/* Include the Search component */}
            <br></br>
            <br></br>
            <h2>Search Results for Category: {category}</h2>
            <table className='table table-striped'>
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
                    {parts.map(part => (
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

export default CategorySearchResults;

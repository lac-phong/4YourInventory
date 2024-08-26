import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from '../components/Search';
import CategoryDropdown from '../components/CategoryDropdown'; // Adjust the import path as necessary

function ManufacturerSearchResults() {
    const { manufacturer } = useParams();
    const [parts, setParts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch parts by manufacturer
    useEffect(() => {
        if (manufacturer) {
            getItemByManufacturer(manufacturer);
        }
    }, [manufacturer]);

    const getItemByManufacturer = async (manufacturer) => {
        try {
            setLoading(true);
            const response = await window.electron.ipcRenderer.invoke('get-parts-by-manufacturer', manufacturer);
            setParts(response);
        } catch (error) {
            console.error('Error fetching parts:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filter parts based on selected category
    const filteredParts = selectedCategory === 'All'
        ? parts
        : parts.filter(part => part.category === selectedCategory);

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
                            <td>{
                                <Link to={`/inventory/${encodeURIComponent(part.part_number)}`}>
                                    {part.part_number}
                                </Link>
                            }</td>
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

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Search from '../components/Search';

function CategorySearchResults() {
    const { category } = useParams();
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (category) {
            getItemsByCategory(category);
        }
    }, [category]);

    const getItemsByCategory = async (category) => {
        try {
            setLoading(true);
            const response = await window.electron.ipcRenderer.invoke('get-parts-by-category', category)
            setParts(response)
        } catch (error) {
            console.error('Error fetching part data:', error);
        } finally {
            setLoading(false);
        }
    }

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

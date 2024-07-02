import React, { useEffect, useState } from 'react';
import Search from "../components/Search";
import '../styles/Inventory.css';
import { GetPart, UpdatePart } from '../services/PartNumServices';
import { useNavigate, useParams } from 'react-router-dom';

function Inventory() {
    const [part, setPart] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { partNumbers } = useParams();
    const navigator = useNavigate();

    useEffect(() => {
        if (partNumbers) {
            GetPart(partNumbers).then((response) => {
                setPart(response.data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [partNumbers]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPart(prevPart => ({
            ...prevPart,
            [name]: value
        }));
    };

    const handleSave = () => {
        UpdatePart(part.id, part).then(() => {
            setIsEditing(false);
        }).catch(error => {
            console.error(error);
        });
    };

    return (
        <div className='inventory'>
            <br></br>
            <Search />
            {part ? (
                <table className='inventory-table'>
                    <thead>
                        <tr>
                            <th>ID Number</th>
                            <th>Part Number</th>
                            <th>Quantity</th>
                            <th>Quantity Sold</th>
                            <th>Locations</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={part.id}>
                            <td>{part.id}</td>
                            <td>{part.partNumber}</td>
                            <td>
                                {isEditing ? (
                                    <input type="number" name="quantity" value={part.quantity} onChange={handleChange} />
                                ) : (
                                    part.quantity
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="number" name="quantitySold" value={part.quantitySold} onChange={handleChange} />
                                ) : (
                                    part.quantitySold
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input type="text" name="locations" value={part.locations} onChange={handleChange} />
                                ) : (
                                    part.locations
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <button onClick={handleSave}>Save</button>
                                ) : (
                                    <button onClick={() => setIsEditing(true)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No part data found.</p>
            )}
        </div>
    )
}

export default Inventory;

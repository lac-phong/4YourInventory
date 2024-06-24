import React from 'react'
import Search from "../components/Search";
import '../styles/Inventory.css'; // Import the CSS file for styling

function Inventory() {
  return (
    <div className='inventory'>
        <br></br>
        <Search />
        <table className='inventory-table'>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Serial #</th>
                    <th>Part #</th>
                    <th>Date Listed</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Quantity on Ebay</th>
                    <th>Last Sold $</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(8)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {[...Array(8)].map((_, colIndex) => (
                            <td key={colIndex}>{`${rowIndex},${colIndex}`}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Inventory

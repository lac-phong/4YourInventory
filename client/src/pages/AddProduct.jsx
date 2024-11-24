import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import CategoryDropdown from '../components/CategoryDropdown';
import ManufacturerDropdown from '../components/ManufacturerDropdown'; 

function AddProduct() {
  const [partNumber, setPartNumber] = useState('');
  const [location, setLocation] = useState('');
  const [serialNumbers, setSerialNumbers] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [newManufacturer, setNewManufacturer] = useState(''); 
  const [itemCondition, setItemCondition] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSerialNumbersChange = (e) => {
    setSerialNumbers(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = serialNumbers.substring(0, cursorPosition);
      const textAfterCursor = serialNumbers.substring(cursorPosition);
      setSerialNumbers(`${textBeforeCursor}\n${textAfterCursor}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const serialNumbersArray = serialNumbers.split(/\r?\n/).map(serial => serial.trim()).filter(serial => serial !== '');

    if (!partNumber || !location || serialNumbersArray.length === 0) {
        setError('Please fill in all fields and add at least one serial number.');
        return;
    }

    let finalCategory = category;
    let finalManufacturer = manufacturer;

    if (newCategory) {
        try {
            const response = await window.electron.ipcRenderer.invoke('insert-category', newCategory);
            if (response.inserted) {
                finalCategory = newCategory;
            } else {
                setError('Category already exists');
                return;
            }
        } catch (error) {
            console.error('Failed to add new category:', error);
            setError('Failed to add new category');
            return;
        }
    }

    if (newManufacturer) {
        try {
            const response = await window.electron.ipcRenderer.invoke('insert-manufacturer', newManufacturer);
            if (response.inserted) {
                finalManufacturer = newManufacturer;
            } else {
                setError('Manufacturer already exists');
                return;
            }
        } catch (error) {
            console.error('Failed to add new manufacturer:', error);
            setError('Failed to add new manufacturer');
            return;
        }
    }

    const payload = {
        partNumber,
        location,
        serialNumbers: serialNumbersArray,
        item_description: itemDescription,
        category: finalCategory,
        manufacturer: finalManufacturer,
        item_condition: itemCondition,
    };

    try {
        setIsSubmitting(true);
        const response = await window.electron.ipcRenderer.invoke('insert-part', payload);
        setIsSubmitting(false);
        if (response.inserted) {
            console.log('Successfully added product!')
            // Reset form
            setPartNumber('');
            setLocation('');
            setSerialNumbers('');
            setItemDescription('');
            setCategory('');
            setManufacturer('');
            setItemCondition('');
            setNewCategory('');
            setNewManufacturer('');
        } else {
            setError('Failed to add product');
        }
    } catch (error) {
        console.error('There was an error adding the product:', error);
        setError('Failed to add product');
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 style={{ marginTop: '4.5rem' }}>Add Product Into Database</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="partNumber">
          <Form.Label>Part Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter part number"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            className="thicker-form-control"
          />
        </Form.Group>

        <Form.Group controlId="location" className="mt-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="thicker-form-control"
          />
        </Form.Group>

        <Form.Group controlId="itemDescription" className="mt-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter item description"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="thicker-form-control"
          />
        </Form.Group>

        <Form.Group controlId="category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <CategoryDropdown
            selectedCategory={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={newCategory !== ''}
            className="thicker-form-control"
          />
          <Form.Control
            type="text"
            placeholder="Add new category (optional)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mt-2 thicker-form-control"
          />
        </Form.Group>

        <Form.Group controlId="manufacturer" className="mt-3">
          <Form.Label>Manufacturer</Form.Label>
          <ManufacturerDropdown
            selectedManufacturer={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            disabled={newManufacturer !== ''}
            className="thicker-form-control"
          />
          <Form.Control
            type="text"
            placeholder="Add new manufacturer (optional)"
            value={newManufacturer}
            onChange={(e) => setNewManufacturer(e.target.value)}
            className="mt-2 thicker-form-control"
          />
        </Form.Group>

        <Form.Group controlId="itemCondition" className="mt-3">
          <Form.Label>Item Condition</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter item condition"
            value={itemCondition}
            onChange={(e) => setItemCondition(e.target.value)}
            className="thicker-form-control"
          />
        </Form.Group>

        <h3 className="mt-5">Serial Numbers</h3>
        <Form.Group controlId="serialNumbers">
          <Form.Label>Paste Serial Numbers (each on a new line)</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={serialNumbers}
            onChange={handleSerialNumbersChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste serial numbers here"
            className="thicker-form-control"
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
      <br />
    </div>
  );
}

export default AddProduct;

import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

function AddProduct() {
  const [partNumber, setPartNumber] = useState('');
  const [location, setLocation] = useState('');
  const [serialNumbers, setSerialNumbers] = useState(['']);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([React.createRef()]);

  useEffect(() => {
    inputRefs.current[inputRefs.current.length - 1].current.focus();
  }, [serialNumbers]);

  const handleAddSerialNumber = (e, index) => {
    const { value } = e.target;
    const list = [...serialNumbers];
    list[index] = value;
    if (index === serialNumbers.length - 1 && value !== '') {
      list.push('');
      inputRefs.current.push(React.createRef());
    }
    setSerialNumbers(list);
  };

  const handleRemoveSerialNumber = (index) => {
    const list = [...serialNumbers];
    list.splice(index, 1);
    inputRefs.current.splice(index, 1);
    setSerialNumbers(list);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index === serialNumbers.length - 1) {
      e.preventDefault();
      handleRemoveSerialNumber(index);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!partNumber || !location || serialNumbers.filter(serial => serial !== '').length === 0) {
      setError('Please fill in all fields and add at least one serial number.');
      return;
    }
    const payload = {
      partNumber,
      location,
      serialNumbers: serialNumbers.filter(serial => serial !== '')
    };

    console.log(payload);

    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:8080/parts', payload); // Ensure URL is correct
      setIsSubmitting(false);
      if (response.data.inserted) {
        alert('Product added successfully');
        setPartNumber('');
        setLocation('');
        setSerialNumbers(['']);
        inputRefs.current = [React.createRef()];
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
      <h2>Add Product</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="partNumber">
          <Form.Label>Part Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter part number"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="location" className="mt-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <h3 className="mt-5">Serial Numbers</h3>
        <Table bordered>
          <thead>
            <tr>
              <th>Serial Number</th>
            </tr>
          </thead>
          <tbody>
            {serialNumbers.map((serial, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    ref={inputRefs.current[index]}
                    type="text"
                    value={serial}
                    onChange={(e) => handleAddSerialNumber(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={`Scan serial number ${index + 1}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="success" type="submit" className="mt-3" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
      <br></br>
    </div>
  );
}

export default AddProduct;

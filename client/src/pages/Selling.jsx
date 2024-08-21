import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function Selling() {
  const [partNumber, setPartNumber] = useState('');
  const [serialNumbers, setSerialNumbers] = useState('');

  const handleSerialNumbersChange = (e) => {
    setSerialNumbers(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      partNumber,
      serialNumbers: serialNumbers
        .split('\n')
        .map(serial => serial.trim())
        .filter(serial => serial !== '') // Filter out empty serial numbers
    };

    try {
      const response = await axios.put('http://localhost:8080/serials', payload);
      if (response.data.updated) {
        alert('Serial numbers marked as sold successfully');
        setPartNumber('');
        setSerialNumbers('');
      } else {
        alert('Failed to mark serial numbers as sold');
      }
    } catch (error) {
      console.error('Error marking serial numbers as sold:', error);
      alert('Error marking serial numbers as sold');
    }
  };

  return (
    <Container className="mt-5">
      <h2 style={{ marginTop: '4.5rem' }}>Mark as Sold</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="partNumber">
          <Form.Label>Part Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter part number"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            required
          />
        </Form.Group>

        <h3 className="mt-5">Serial Numbers</h3>
        <Form.Group controlId="serialNumbers">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Paste serial numbers here, one per line"
            value={serialNumbers}
            onChange={handleSerialNumbersChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3">
          Sold
        </Button>
      </Form>
      <br/>
    </Container>
  );
}

export default Selling;

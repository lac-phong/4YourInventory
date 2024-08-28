import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function Selling() {
  const [serialNumbers, setSerialNumbers] = useState('');

  const handleSerialNumbersChange = (e) => {
    setSerialNumbers(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serialsArray = serialNumbers
      .split('\n')
      .map(serial => serial.trim())
      .filter(serial => serial !== ''); // Ensure non-empty serial numbers

    // Check if serialsArray is empty and display an alert
    if (serialsArray.length === 0) {
      return;
    }

    const payload = { serialNumbers: serialsArray };

    try {
      const response = await window.electron.ipcRenderer.invoke('mark-serials-sold', payload);
      if (response.updated) {
        setSerialNumbers(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error marking serial numbers as sold:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 style={{ marginTop: '4.5rem' }}>Mark as Sold</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="serialNumbers">
          <Form.Label>Serial Numbers (one per line)</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={serialNumbers}
            onChange={handleSerialNumbersChange}
            placeholder="Enter serial numbers here, one per line"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Mark
        </Button>
      </Form>
    </Container>
  );
}

export default Selling;

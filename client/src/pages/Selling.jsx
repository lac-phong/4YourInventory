import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function Selling() {
  const [serialNumbers, setSerialNumbers] = useState('');

  const handleSerialNumbersChange = (e) => {
    setSerialNumbers(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      serialNumbers: serialNumbers
        .split('\n')
        .map(serial => serial.trim())
        .filter(serial => serial !== '') // Filter out empty serial numbers
    };

    try {
      const response = await window.electron.ipcRenderer.invoke('mark-serials-sold', payload);
      if (response.updated) {
        alert('Serial numbers marked as sold successfully');
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
        <h4 className="mt-2">Serial Numbers - One Per Line</h4>
        <Form.Group controlId="serialNumbers">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Paste serial numbers here, the database will auto-handle differing part numbers"
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

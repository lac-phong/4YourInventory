import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Table, Container } from 'react-bootstrap';

function Selling() {
  const [partNumber, setPartNumber] = useState('');
  const [serialNumbers, setSerialNumbers] = useState(['']);
  const inputRefs = useRef([React.createRef()]);

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[inputRefs.current.length - 1].current.focus();
    }
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
    if (e.key === 'Backspace' && !e.target.value) {
        e.preventDefault();
        if (serialNumbers.length > 1) { // Ensure that there's more than one serial number input
            handleRemoveSerialNumber(index);
        }
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      partNumber,
      serialNumbers: serialNumbers.filter(serial => serial !== '') // Filter out empty serial numbers
    };

    try {
      const response = await window.electron.ipcRenderer.invoke('mark-serials-sold', payload);
      if (response.updated) {
        alert('Serial numbers marked as sold successfully');
        setPartNumber('');
        setSerialNumbers(['']);
        inputRefs.current = [React.createRef()];
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
      <h2>Selling Page</h2>
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

        <Button variant="success" type="submit" className="mt-3">
          Sold
        </Button>
      </Form>
      <br></br>
    </Container>
  );
}

export default Selling;

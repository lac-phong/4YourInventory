import React, { useState } from 'react';
import { Form, Button, InputGroup, Col, Row } from 'react-bootstrap';
import '../styles/Listing.css';

function Listing() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [condition, setCondition] = useState('');
  const [itemSpecifics, setItemSpecifics] = useState([
    { key: 'Condition', value: '' },
    { key: 'Brand', value: '' },
    { key: 'Type', value: '' },
    { key: 'MPN', value: '' },
    { key: 'Capacity', value: '' },
  ]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSpecificChange = (index, field, value) => {
    const newItemSpecifics = [...itemSpecifics];
    newItemSpecifics[index][field] = value;
    setItemSpecifics(newItemSpecifics);

    if (newItemSpecifics[index].key === 'Condition') {
      setCondition(newItemSpecifics[index].value);
    }
  };

  const addSpecific = () => {
    setItemSpecifics([...itemSpecifics, { key: '', value: '' }]);
  };

  const removeSpecific = (index) => {
    const newItemSpecifics = [...itemSpecifics];
    newItemSpecifics.splice(index, 1);
    setItemSpecifics(newItemSpecifics);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const getUsageDescription = () => {
    return `${condition ? condition + '. ' : ''}Excellent working and cosmetic conditions.`;
  };

  return (
    <div className="container mt-5">
      <h2>List an Item</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="partNumber" className="mb-3">
          <Form.Label style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'green' }}>
            Auto Update with Part Number
          </Form.Label>
          <InputGroup style={{ maxWidth: '500px' }}>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="Part Number"
                  style={{ border: '2px solid green', boxShadow: 'none', flex: '1 1 auto' }}
                />
              </Col>
              <Col>
                <Button 
                  variant="success" 
                  type="button" 
                  onClick={() => console.log('Part Number Entered')} 
                  style={{ border: 'none', borderLeft: 'none' }}
                >
                  Enter
                </Button>
              </Col>
            </Row>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Item Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter item description"
          />
        </Form.Group>

        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price (USD)</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="quantity" className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </Form.Group>

        <h4>Item Specifics</h4>
        {itemSpecifics.map((specific, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                value={specific.key}
                onChange={(e) => handleSpecificChange(index, 'key', e.target.value)}
                placeholder="Specific Name (e.g., Color, Size)"
                disabled={index < 5}  // Disable editing for default specifics
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                value={specific.value}
                onChange={(e) => handleSpecificChange(index, 'value', e.target.value)}
                placeholder="Specific Value (e.g., Red, Large)"
              />
            </Col>
            {index >= 5 && (
              <Col xs="auto">
                <Button 
                  variant="danger" 
                  onClick={() => removeSpecific(index)} 
                  style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  Remove
                </Button>
              </Col>
            )}
          </Row>
        ))}
        <Button 
          variant="primary" 
          onClick={addSpecific} 
          className="mb-3" 
          style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
        >
          Add
        </Button>

        <div className="d-flex justify-content-center my-4">
          <Button 
            variant="success" 
            type="submit" 
            style={{ width: '200px', height: '60px', fontSize: '18px' }}
          >
            Submit Listing
          </Button>
        </div>
      </Form>

      <footer className="mt-5 pt-3" style={{ borderTop: '1px solid #ddd' }}>
        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>Usage</h3>
            <p style={{ textAlign: 'left' }}>{getUsageDescription()}</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>Payment</h3>
            <p style={{ textAlign: 'left' }}>Payment made within the 7 days of bid winning is mostly appreciated. Reporting unpaid bidders is our last option.</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>Shipping</h3>
            <p style={{ textAlign: 'left' }}>Local pick up is available.</p>
            <p style={{ textAlign: 'left' }}>
              International buyers, please contact us for shipping quote before buying. Item(s) will be shipped within 24-business-hour of payment receipt.
            </p>
            <p style={{ textAlign: 'left' }}>
              You are welcome to use your FedEx/UPS/DHL account for shipping. Expedited shipping and Blind ship are available. Please contact us via eBay messaging.
            </p>
            <p style={{ textAlign: 'left' }}>
              All shipments with value of more than $250 will require your signature for delivery. If the item is returned to us because an adult is not available to sign for the delivery, there will be 10% of restocking fee.
            </p>
            <p style={{ textAlign: 'left', color: 'darkred', fontWeight: 'bold' }}>
              ***** SHIPPING TO RUSSIA IS NOT AVAILABLE AT THIS TIME. *****
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>Terms of Sale</h3>
            <p style={{ textAlign: 'left' }}>Please see item description for warranty information.</p>
            <p style={{ textAlign: 'left' }}>All claims for packages that have been damaged during shipment must be reported within 3-business-day of item(s) being delivered.</p>
            <p style={{ textAlign: 'left' }}>International buyers: We are not responsible for any VAT fee, import duties, taxes, customs delay, etc.</p>
            <p style={{ textAlign: 'left' }}>Power cords and other accessories are NOT included unless specifically listed in the auction.</p>
            <p style={{ textAlign: 'left' }}>All return or cancelled transactions are subject to be charged 5% of the total.</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>About Us</h3>
            <p style={{ textAlign: 'left' }}>
              We buy and sell a wide variety of computer and network equipment. Please contact us if you need equipment which are not listed in our auctions. We will try our best to accommodate your request at the lowest prices possible.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 style={{ fontSize: '1.5rem', color: 'darkred', fontWeight: '900', textAlign: 'left' }}>Contact Us</h3>
            <p style={{ textAlign: 'left' }}>eBay Messages</p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center">
            <p>© 2024 4YourBusiness Inc. All rights reserved.</p>
          </Col>
        </Row>
      </footer>
    </div>
  );
}

export default Listing;

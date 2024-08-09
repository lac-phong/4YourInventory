import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dash.css';

function Dash() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/search');  // Navigate to the home page
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Card className="text-center shadow-lg">
            <Card.Body>
              <Card.Title>Welcome to Our Inventory App</Card.Title>
              <Card.Text>
                Your one-stop solution for managing inventory efficiently.
              </Card.Text>
              <Button variant="success" onClick={handleGetStarted}>
                Get Started
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
          <Col>
            <Card className="shadow-lg">
              <Card.Body>
                <Card.Title>Hottest Items on eBay</Card.Title>
                <Card.Text>
                  {/* Placeholder for eBay API integration */}
                  Check out the items that are trending the most in terms of sales:
                </Card.Text>
                <Button variant="primary">View More</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      <div className='hottest'>
      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>About Us</Card.Title>
              <Card.Text>
              4yourbusiness, Inc. was established in 2008 with a vision to provide top-quality equipment at unbeatable prices. Over the years, we have grown and evolved, and today, our 7000-square-foot store proudly stands in the heart of Downtown Hayward, California, serving as a beacon of reliability and value for our customers. Our journey has been marked by our unwavering commitment to offering exceptional products at discounts of up to 80%, making us a trusted source for businesses and individuals alike. Our meticulous approach ensures that every piece of equipment we sell is thoroughly tested and inspected, guaranteeing its full functionality and reliability. This attention to detail underpins our 100% satisfaction warranty policy, which has become a cornerstone of our business, giving our customers the confidence they need to make informed purchasing decisions. At 4yourbusiness, Inc., we believe that excellent customer service is not just about meeting expectations but exceeding them. Our team of knowledgeable and dedicated staff members is always ready to assist, providing prompt and personalized service to meet your specific needs. If you're looking for a particular piece of equipment or need advice on the best solutions for you, we can help!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>How to Use This App</Card.Title>
              <Card.Text>
                Use the dynamic search bar to search for items by Part Number, Serial Number, Manufacturer, or Category. The Add Product page will make it easy for you to add newly bought items into our database. There is also a Selling page where you can input sold items to update the inventory and maintain accuracy. Different Manufacturers: Cisco, Dell, EMC, Hitachi, HP, LSI L..., NetApp, Nortel, Qlogic; Different Categories: Disk Storage Chassis, CPUs, Processors, Disk Array Components, Disk Controllers, RAID Cards, Drive Cables & Adapters, Ethernet Cables (RJ-45, 8P8C), External Hard Disk Drives, Firewall & VPN Devices, Internal Hard Disk Drives, Internal Network Cards, Memory (RAM), NAS Disk Arrays, Network Switches, Optical Fiber Cables, Other, Parallel, Serial & PS/2, Patch Panels, Plugs, Power Cables & Connectors, Power Distribution Units, Power Supplies, Rackmount Cabinets & Frames, Router Modules/Cards/Adapters, SAN Disk Arrays, Server CPUs, Processors, Server Memory (RAM), Server Power Supplies, Servers, Switch Modules, Switch Power Supplies, VoIP Business Phones, IP PBX, Wired Routers, Power Cords, Server Blades, Fans, RAM, Ethernet Pass Through, Flash Cache Cards, SFP, FCP Target Cards, Network Interface Card (NIC);
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </Container>
  );
}

export default Dash;
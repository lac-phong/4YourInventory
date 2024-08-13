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
                Use the dynamic search bar to easily find items based on various criteria, including Part Number, Serial Number, Manufacturer, or Category. This feature is designed to help you quickly locate specific items from our extensive inventory. On the Add Product page, you’ll find a user-friendly interface that simplifies the process of adding newly acquired items to our database. This ensures that all new inventory is accurately recorded and easily accessible. Additionally, there is a dedicated Selling page where you can input details of sold items to update the inventory. This feature is crucial for maintaining accurate and up-to-date records, ensuring that our inventory reflects the most current status. <strong>Accuracy in this application is of utmost importance, so please be cautious when adding or deleting Manufacturers and Categories—do so only when absolutely necessary to avoid disrupting the integrity of our database.</strong> When you search by Part Number, the results will also include items that are currently listed on eBay, giving you a comprehensive view of the item’s availability and pricing across different platforms. This added functionality helps in making informed decisions and ensures you have the most relevant information at your fingertips.
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
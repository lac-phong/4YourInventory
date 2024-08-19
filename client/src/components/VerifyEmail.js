import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/VerifyEmail.css';

export default function VerifyEmail() {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/');
  };

  return (
    <Container fluid className="verify-email-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4}>
          <Card className="text-center shadow-lg">
            <Card.Body>
              <h2 className="fw-bold mb-4">Verify Your Email</h2>
              <p className="mb-4">
                A verification link has been sent to your email. Please check your inbox and click the link to verify your email address.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleReturnToLogin}
                className="w-100"
              >
                Return to Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

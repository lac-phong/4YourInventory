import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Alert } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/logo4yb.png";
import ReorderIcon from '@mui/icons-material/Reorder';
import '../styles/Navbar.css';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to logout. Please try again.");
    }
  }

  return (
    <>
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Navbar variant="dark" expand="lg" fixed="top" expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/home">
            <img src={Logo} alt="Logo" style={{ width: '70px' }} />
          </Navbar.Brand>
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(!expanded)}
          >
            <ReorderIcon style={{ color: 'white' }} />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center">
              <Nav.Link as={Link} to="/home" onClick={() => setExpanded(false)}>Home</Nav.Link>
              <Nav.Link as={Link} to="/search" onClick={() => setExpanded(false)}>Search</Nav.Link>
              <Nav.Link as={Link} to="/addproduct" onClick={() => setExpanded(false)}>Add Product</Nav.Link>
              <Nav.Link as={Link} to="/selling" onClick={() => setExpanded(false)}>Mark Sold</Nav.Link>
              {currentUser && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    handleLogout();
                    setExpanded(false);
                  }} 
                  className="nav-link btn-link"
                >
                  Logout
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: '50px' }}></div>
    </>
  );
}
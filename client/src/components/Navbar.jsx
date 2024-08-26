import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container, Button, Alert } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import ReorderIcon from '@mui/icons-material/Reorder';
import '../styles/Navbar.css';

// Rename your custom component to avoid conflict
export default function CustomNavbar() {
  const [logoPath, setLogoPath] = useState('');

  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-image-path', 'logo4yb.png').then((imagePath) => {
      setLogoPath(imagePath);
    });
  }, []);

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

      <BootstrapNavbar variant="dark" expand="lg" fixed="top" expanded={expanded}>
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/home">
            {logoPath && <img src={logoPath} alt="Logo" style={{ width: '70px' }}/>}
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          >
            <ReorderIcon style={{ color: 'white' }} />
          </BootstrapNavbar.Toggle>
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
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
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <div style={{ height: '50px' }}></div>
    </>
  );
}


import React, { useRef, useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
from 'mdb-react-ui-kit';
import '../styles/Login.css';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


 async function handleSubmit(e) {
    e.preventDefault()


    try{
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate("/home")
    } catch{
      setError('Failed to sign in')
    }


    setLoading(false)
  }


  return (
    <div className="right-background">
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">4YourBusinness Inc.</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <div className="green-button">
              <Button disabled={loading} className="w-100" type="submit">Login</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Don't have an account? <a href="/signup">Click Here</a>
        </div>
      </div>
    </Container>
    </div>
  );
}




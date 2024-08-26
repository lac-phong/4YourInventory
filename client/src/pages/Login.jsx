import React, { useRef, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import '../styles/Login.css';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/home");
    } catch {
      setError('Failed to sign in');
    }

    setLoading(false);
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol md='6'>
          <div className='d-flex flex-row ps-5 pt-5'>
            <i className="fab fa-ebay display-5 pr-5 text-success" style={{ width: 90 }}></i>
            <span className="h1 fw-bold mb-0 display-4">4YourBusiness Inc.</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 pt-4' style={{ width: '85%' }}>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Log in</h3>
            {error && <Alert variant="danger" className="mx-5">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-4 mx-5 w-100">
                <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="mb-4 mx-5 w-100">
                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" ref={passwordRef} required />
              </Form.Group>
              <MDBBtn disabled={loading} className="mb-4 px-5 mx-5 w-100" color='success' size='lg'>Login</MDBBtn>
            </Form>
            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
        </MDBCol>

        <MDBCol md='6' className='d-none d-md-block px-0'>
          <div className="login-image-container">
            <img src="https://images.unsplash.com/photo-1680095448731-a53cd40462c0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVydGljYWwlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D"
              alt="Login" className="login-image" />
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

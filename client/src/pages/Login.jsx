import React, { useRef, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
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
        <MDBCol sm='6'>
          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">4YourBusiness Inc.</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>
            {error && <Alert variant="danger" className="mx-5">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-4 mx-5 w-100">
                <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password" className="mb-4 mx-5 w-100">
                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" ref={passwordRef} required />
              </Form.Group>
              <MDBBtn disabled={loading} className="mb-4 px-5 mx-5 w-100" color='info' size='lg'>Login</MDBBtn>
            </Form>
            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="/forgotpassword">Forgot password?</a>
            </p>
            <p className='ms-5'>
              Don't have an account? <Link to="/signup" className="link-info">Register here</Link>
            </p>
          </div>
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'left'}} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

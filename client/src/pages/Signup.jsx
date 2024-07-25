import React, { useRef, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import '../styles/Signup.css';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <MDBContainer fluid className='signup-container'>
      <MDBRow className='g-0 align-items-center signup-row'>
        <MDBCol md='6'>
          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-5 shadow-5 text-center'>
              <h2 className="fw-bold mb-5">Sign up now</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' ref={emailRef} required />
                <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' ref={passwordRef} required />
                <MDBInput wrapperClass='mb-4' label='Confirm Password' id='form5' type='password' ref={passwordConfirmRef} required />

                <MDBBtn disabled={loading} className='w-100 mb-4' size='md' type="submit">Sign Up</MDBBtn>
              </Form>

              <div className="w-100 text-center mt-2">
                Already have an account? <a href="/">Click Here</a>
                <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="/forgotpassword">Forgot password?</a>
            </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md='6' className='signup-image-col'>
          <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className="w-100 h-100 signup-image" alt="" />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

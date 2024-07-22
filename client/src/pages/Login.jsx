import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import '../styles/Login.css';
import LogoImage from "../assets/homeBack.png";


function Login() {
  return (
    <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6' className='white-background'>

          <div className='d-flex flex-column align-items-center pt-5'>
            <img src={LogoImage} alt="logo" style={{width: '450px', height: '180px'}} className="logo-img" />
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg"/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' size="lg"/>

            <MDBBtn className="mb-4 px-5 mx-5 w-100 green-button" size='lg'>Login</MDBBtn>
            <p className="small mb-5 pb-lg-3 ms-5"><a className="text-muted" href="#!">Forgot password?</a></p>
            <p className='ms-5'>Don't have an account? <a href="#!" className="link-info">Register here</a></p>

          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0 right-background'>
          <div className='green-text-container'>
            <h4 className="text-white">Your Personalized Inventory Manager</h4>
            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default Login;

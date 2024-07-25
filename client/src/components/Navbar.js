import React, { useState } from "react";
import Logo from "../assets/logo4yb.png";
import { Link, useNavigate } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/Navbar.css";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()


  async function handleLogout(){
    setError('')
    try{
      await logout()
      navigate("/")
    } catch{
      setError('Failed to logout')
    }
  }

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} />
        <div className="hiddenLinks">
          <Link to="/home"> Home </Link>
          <Link to="/dashboard"> Dashboard </Link>
          <Link to="/addproduct"> Add Product </Link>
          <Link to="/selling"> Selling </Link>
          <Link to="/" className="logout-link" onClick={handleLogout}> Logout </Link>
        </div>
      </div>
      <div className="rightSide">
        <Link to="/home"> Home </Link>
        <Link to="/dashboard"> Dashboard </Link>
        <Link to="/addproduct"> Add Product </Link>
        <Link to="/selling"> Selling </Link>
        <Link to="/" className="logout-link" onClick={handleLogout}> Logout </Link>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}


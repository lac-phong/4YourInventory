import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/Navbar.css";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {

  const [openLinks, setOpenLinks] = useState(false);
  const [logoPath, setLogoPath] = useState('');

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-image-path', 'logo4yb.png').then((imagePath) => {
      setLogoPath(imagePath);
    });
  }, []);


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
        {logoPath && <img src={logoPath} alt="Logo" />}
        <div className="hiddenLinks">
          <Link to="/home"> Home </Link>
          <Link to="/search"> Search </Link>
          <Link to="/addproduct"> Add Product </Link>
          <Link to="/selling"> Selling </Link>
          <Link to="/" className="logout-link" onClick={handleLogout}> Logout </Link>
        </div>
      </div>
      <div className="rightSide">
        <Link to="/home"> Home </Link>
        <Link to="/search"> Search </Link>
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

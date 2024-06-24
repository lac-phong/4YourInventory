import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Image from "../assets/homeBack.png"

function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
        if (email === "4yb@gmail.com" && pass === "ilove4yb") {
            navigate('/home');
        }
    }

    return (
        <div className="Logpage">
            <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="" id="password" name="password" />
                <button type="submit">Sign in</button>
            </form>
        </div>
        <div className="logoimg">
            <img src={Image} />
        </div>
    </div>
    );
}

export default Login

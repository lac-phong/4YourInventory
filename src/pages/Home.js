import React, { useState } from 'react';
import BannerImage from "../assets/homeBack.png";
import "../styles/Home.css";

function Home() {
  const [input, setInput] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Submit Alert');
  };


  return (
    <div className='Home'>
      <div className='imageCont'>
        <img src={BannerImage} alt="Logo" />
      </div>
      <div className='searchBar'>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          <input type="submit" />
        </form>
      </div>  
    </div>
  )
}
export default Home

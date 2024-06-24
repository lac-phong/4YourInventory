import React from 'react';
import Search from "../components/Search";
import BannerImage from "../assets/homeBack.png";
import "../styles/Home.css";

function Home() {
  return (
    <div className='Home'>
      <div className='imageCont'>
        <img src={BannerImage} alt="Logo" />
      </div>
      <div className='searchBar'>
        <Search />
      </div>  
    </div>
  )
}
export default Home

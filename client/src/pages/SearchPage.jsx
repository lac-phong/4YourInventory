import React from 'react';
import Search from "../components/Search";
import "../styles/Home.css";

function Home() {
  return (
    <div className='Home'>
      <div className='searchBar'>
        <Search />
      </div>  
    </div>
  )
}
export default Home

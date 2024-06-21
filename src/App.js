import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dash";
import AddProduct from "./pages/AddProduct";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"; 

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;


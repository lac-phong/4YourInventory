import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dash";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/inventory/:partNumbers" element={<Inventory />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;

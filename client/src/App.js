import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dash";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Selling from "./pages/Selling";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoutes';

function Layout() {
  const location = useLocation();

  return (
    <AuthProvider>
    <div className="router-wrapper">
      {location.pathname !== "/" && location.pathname !== "/signup" && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/inventory/:partNumber" element={<Inventory />} />
        </Route>
      </Routes>
    </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout />
        <Footer />
      </Router>
    </div>
  );
}

export default App;

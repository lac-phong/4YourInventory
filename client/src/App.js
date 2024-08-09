import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dash";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import SerialNumber from './pages/SerialNumber';
import Login from "./pages/Login";
import Selling from "./pages/Selling";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoutes';
import ForgotPassword from './pages/forgotpassword';
import ManufacturerSearchResults from "./pages/ManufacturerSearchResults"; // Import the new component
import CategorySearchResults from "./pages/CategorySearchResults"; // Import the new component

function Layout() {
  const location = useLocation();

  return (
    <AuthProvider>
    <div className="router-wrapper">
      {location.pathname !== "/" && location.pathname !== "/signup" && location.pathname !== "/forgotpassword" && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} /> 
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/inventory/:partNumber" element={<Inventory />} />
          <Route path="/serials/:serialNumber" element={<SerialNumber />} />
          <Route path="/parts/manufacturer/:manufacturer" element={<ManufacturerSearchResults />} />
          <Route path="/parts/category/:category" element={<CategorySearchResults />} />
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

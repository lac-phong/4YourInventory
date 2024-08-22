import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Search from "./pages/Home";
import Dashboard from "./pages/Dash";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import SerialNumber from './pages/SerialNumber';
import Login from "./pages/Login";
import Selling from "./pages/Selling";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoutes';
import ForgotPassword from './pages/forgotpassword';
import ManufacturerSearchResults from "./pages/ManufacturerSearchResults";
import CategorySearchResults from "./pages/CategorySearchResults";

function Layout() {
  const location = useLocation();

  const isPublicRoute = ["/", "/forgotpassword"].includes(location.pathname);

  return (
    <div className="router-wrapper">
      {!isPublicRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/selling" element={<Selling />} />
          <Route path="/inventory/:partNumber" element={<Inventory />} />
          <Route path="/serials/:serialNumber" element={<SerialNumber />} />
          <Route path="/parts/manufacturer/:manufacturer" element={<ManufacturerSearchResults />} />
          <Route path="/parts/category/:category" element={<CategorySearchResults />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Layout />
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
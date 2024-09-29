import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import DriverLogin from './components/DriverLogin';
import ClientLogin from './components/ClientLogin';
import Register from './components/Register';
import ClientHome from './components/ClientHome';
import DriverHome from './components/DriverHome';
import DriverRoute from './components/DriverRoute';
import RouteDetails from './components/RouteDetails';
import AboutUs from './components/AboutUs';
import Navbar from './components/Navbar';
import ContactUs from './components/ContactUs';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';

const NavbarWrapper = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const noNavbarRoutes = ['/admin-login', '/driver-login', '/client-login', '/register', '/driver-home','/client-home'];

  return !noNavbarRoutes.includes(location.pathname) ? <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} /> : null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <NavbarWrapper isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client-home" element={<ClientHome />} />
          <Route path="/driver-home" element={<DriverHome />} />
          <Route path="/driver-route" element={<DriverRoute />} />
          <Route path="/route-details" element={<RouteDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpg';

const Navbar = ({ isLoggedIn, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Ride Sharing Logo" className="logo-img" />
                <div className="logo-text">Ride Sharing</div>
            </div>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/available-cabs">Available Cabs</Link>
                {!isLoggedIn ? (
                    <>
                        <div className="login-dropdown">
                            <button className="nav-button" onClick={toggleDropdown}>Login</button>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <Link to="/admin-login">Admin</Link>
                                    <Link to="/driver-login">Driver</Link>
                                    <Link to="/client-login">Client</Link>
                                </div>
                            )}
                        </div>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span className="nav-link" onClick={onLogout}>Logout</span>
                        <Link to="/driver-panel">Driver Panel</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

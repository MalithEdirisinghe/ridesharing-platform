// // src/components/Header.js
// import React from 'react';

// const Header = () => {
//     return (
//         <header>
//             <h1>Ridesharing Platform</h1>
//         </header>
//     );
// };

// export default Header;

import React from 'react';
import './Header.css'; // Make sure to create and style this file as needed
import logo from '../assets/logo.jpg'; // Replace with the correct path

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Ride Sharing Logo" className="logo" />
            </div>
            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/available-cabs">Available Cabs</a>
                <a href="/logout">Logout</a>
            </nav>
        </header>
    );
};

export default Header;

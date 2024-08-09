import React from 'react';
import './HomePage.css';

const HomePage = ({ isLoggedIn, onLogout }) => {
    return (
        <div className="home-page">
            <main className="main-content">
                <h1>Ridesharing Platform</h1>
                <div className="welcome-box">
                    <h2>Welcome To Our Ridesharing Platform</h2>
                    <p>We offer a cost-effective, efficient, and eco-friendly transportation solution for daily commuters.</p>
                </div>
            </main>
            <footer className="footer">
                <p>© RP 2024 ~ Developed By: T.R. Piyumi Probodani</p>
            </footer>
        </div>
    );
};

export default HomePage;

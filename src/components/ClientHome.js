import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientHome.css';
import io from 'socket.io-client';
import logo from '../assets/logo.jpg';

const ClientHome = () => {
    const [routes, setRoutes] = useState([]);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            console.log('Logged in user:', loggedUser); // Debugging line
            setUser(loggedUser); // Store user details in state
            const newSocket = io('http://localhost:5000');
            newSocket.emit('join', loggedUser.clientId);
            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, []);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/routes');
                const data = await response.json();
                if (response.ok) {
                    console.log('Fetched routes:', data.routes);
                    setRoutes(data.routes || []);
                } else {
                    console.error('Error response:', data.error);
                }
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        fetchRoutes();
    }, []);

    const viewRouteDetails = (route) => {
        navigate('/route-details', { state: { route } });
    };

    return (
        <div className="client-home">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                </div>
                <nav className="nav-links">
                    <a href="/">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/available-cabs">Available Cabs</a>
                    <a href="/logout">Logout</a>
                </nav>
            </header>
            <main className="main-content">
                <h1>Welcome, {user?.username}!</h1> {/* Display the client username */}
                <div className="routes-section">
                    <h2>Available Routes</h2>
                    <div className="routes-list">
                        {routes.length > 0 ? (
                            routes.map((route, index) => (
                                <div key={index} className="route-item">
                                    <p><strong>Origin:</strong> {route.origin}</p>
                                    <p><strong>Destination:</strong> {route.destination}</p>
                                    {route.route && route.route.legs && route.route.legs.length > 0 && (
                                        <>
                                            <p><strong>Distance:</strong> {route.route.legs[0].distance.text}</p>
                                            <p><strong>Duration:</strong> {route.route.legs[0].duration.text}</p>
                                        </>
                                    )}
                                    <p><strong>Driver Name:</strong> {route.driverName}</p>
                                    <p><strong>Posted Time:</strong> {new Date(route.created_at).toLocaleString()}</p>
                                    <button onClick={() => viewRouteDetails(route)}>View More</button>
                                </div>
                            ))
                        ) : (
                            <p>No routes available</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientHome;

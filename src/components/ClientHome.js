import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import './ClientHome.css';
import io from 'socket.io-client';
import logo from '../assets/logo.jpg';

const ClientHome = () => {
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null);

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const center = {
        lat: 6.9271,
        lng: 79.8612,
    };

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
            const newSocket = io('http://localhost:5000');
            newSocket.emit('join', loggedUser.clientId);

            console.log('Client socket connected:', newSocket.connected);
            console.log('Client joined room:', loggedUser.clientId);

            setSocket(newSocket);

            newSocket.on('booking_accepted', (notification) => {
                console.log('Received booking_accepted notification:', notification);
                setBookings((prevBookings) => [...prevBookings, notification]);
            });

            return () => newSocket.close();
        }
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/routes?origin=${origin}&destination=${destination}`);
            const data = await response.json();
            console.log('Fetched routes data:', data);

            if (response.ok) {
                setRoutes(data.routes || []);
            } else {
                console.error('Error response:', data.error);
            }
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const fetchDirections = () => {
        if (!origin || !destination) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionsResponse(result); 
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetchDirections();
        fetchRoutes();
    };

    const onLoad = (map) => {
        mapRef.current = map;
    };

    const onDirectionsLoad = () => {
        if (directionsResponse && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            directionsResponse.routes[0].legs.forEach((leg) => {
                leg.steps.forEach((step) => {
                    bounds.extend(step.start_location);
                    bounds.extend(step.end_location);
                });
            });
            mapRef.current.fitBounds(bounds);
        }
    };

    const viewRouteDetails = (route) => {
        navigate('/route-details', { state: { route } });
    };

    const viewMyBookings = () => {
        navigate('/my-bookings', { state: { bookings } });
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
                <h1>Welcome, {user?.username}!</h1>
                <div className="route-form">
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Enter origin"
                            required
                        />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter destination"
                            required
                        />
                        <button type="submit">Find Route</button>
                    </form>
                </div>
                <div className="map-container">
                    <LoadScript googleMapsApiKey="AIzaSyDW5IgT0-rJ4RzMHM61hXQQrxd2H1HZq0A">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={10}
                            onLoad={onLoad}
                        >
                            {directionsResponse && (
                                <DirectionsRenderer
                                    directions={directionsResponse}
                                    onLoad={onDirectionsLoad}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
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
                <div className="bookings-section">
                    <button onClick={viewMyBookings} className="view-bookings-button">
                        View My Bookings
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ClientHome;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverHome.css';
import io from 'socket.io-client';
import logo from '../assets/logo.jpg';

const DriverHome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pendingBookings, setPendingBookings] = useState([]);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        console.log('Logged user:', loggedUser);
        if (loggedUser) {
            setUser(loggedUser);

            const socket = io('http://localhost:5000');
            socket.emit('join', loggedUser.driverId);

            // Fetch pending bookings for the logged-in driver
            fetch(`http://localhost:5000/api/bookings/pending/${loggedUser.driverId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Pending bookings fetched:', data); // Debugging line
                    if (data.bookings) {
                        setPendingBookings(data.bookings);
                    } else {
                        console.error('No bookings found or an error occurred:', data);
                    }
                })
                .catch((error) => console.error('Error fetching pending bookings:', error));

            return () => socket.close();
        } else {
            navigate('/driver-login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/driver-login');
    };

    const handlePostRoute = () => {
        navigate('/driver-route', { state: { driverId: user.driverId, driverName: user.username } });
    };

    const handleAcceptBooking = (bookingId) => {
        fetch(`http://localhost:5000/api/bookings/${bookingId}/accept`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    setPendingBookings((prevBookings) =>
                        prevBookings.filter((booking) => booking.id !== bookingId)
                    );
                }
            })
            .catch((error) => console.error('Error accepting booking:', error));
    };

    const handleDeclineBooking = (bookingId) => {
        fetch(`http://localhost:5000/api/bookings/${bookingId}/decline`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    alert(data.message);
                    setPendingBookings((prevBookings) =>
                        prevBookings.filter((booking) => booking.id !== bookingId)
                    );
                }
            })
            .catch((error) => console.error('Error declining booking:', error));
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="driver-home">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                    <span>{user.username}</span>
                </div>
                <nav className="nav-links">
                    <a href="/">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/available-cabs">Available Cabs</a>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </nav>
            </header>
            <main className="main-content">
                <h1>Driver Home</h1>
                <div className="welcome-box">
                    <h2>Welcome, {user.username}!</h2>
                    <p>Driver ID: {user.driverId}</p>
                    {user.profilePicture && (
                        <img
                            src={`data:image/jpeg;base64,${user.profilePicture}`}
                            alt="Profile"
                            className="profile-picture"
                        />
                    )}
                </div>
                <button onClick={handlePostRoute} className="post-route-button">
                    Post a Route
                </button>
                <div className="pending-bookings">
                    <h2>Pending Bookings</h2>
                    {pendingBookings.length > 0 ? (
                        pendingBookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Route ID:</strong> {booking.routeId}</p>
                                <p><strong>Client Name:</strong> {booking.username}</p>
                                <p><strong>Status:</strong> {booking.status}</p>
                                <p><strong>Contact Number:</strong> {booking.mobileNumber}</p>
                                <p><strong>Booked At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                                <div className="button-container">
                                    <button onClick={() => handleAcceptBooking(booking.id)}>Accept</button>
                                    <button onClick={() => handleDeclineBooking(booking.id)}>Decline</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No pending bookings</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DriverHome;

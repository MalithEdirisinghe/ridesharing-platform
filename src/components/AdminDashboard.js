import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch('http://localhost:5000/api/admin/bookings', {
                headers: {
                    'Authorization': `Basic ${localStorage.getItem('adminToken')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setBookings(data.bookings);
            } else {
                console.error('Error fetching bookings:', data.error);
            }
        };

        const fetchRoutes = async () => {
            const response = await fetch('http://localhost:5000/api/admin/routes', {
                headers: {
                    'Authorization': `Basic ${localStorage.getItem('adminToken')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRoutes(data.routes);
            } else {
                console.error('Error fetching routes:', data.error);
            }
        };

        fetchBookings();
        fetchRoutes();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-section">
                <h3>All Bookings</h3>
                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <div key={index} className="booking-item">
                            <p><strong>Route:</strong> {booking.origin} to {booking.destination}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Client Name:</strong> {booking.clientName}</p>
                            <p><strong>Driver Name:</strong> {booking.driverName}</p>
                            <p><strong>Booked At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No bookings available</p>
                )}
            </div>

            <div className="dashboard-section">
                <h3>All Routes</h3>
                {routes.length > 0 ? (
                    routes.map((route, index) => (
                        <div key={index} className="route-item">
                            <p><strong>Origin:</strong> {route.origin}</p>
                            <p><strong>Destination:</strong> {route.destination}</p>
                            <p><strong>Driver Name:</strong> {route.driverName}</p>
                            <p><strong>Posted At:</strong> {new Date(route.created_at).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No routes available</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

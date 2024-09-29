import React, { useState, useEffect } from 'react';
import './MyBookings.css';

const MyBookings = () => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState('Accepted');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings?clientId=${loggedUser.clientId}&status=${activeTab.toLowerCase()}`);
                const data = await response.json();
                if (response.ok) {
                    setBookings(data.bookings || []);
                } else {
                    console.error('Error fetching bookings:', data.error);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [activeTab, loggedUser.clientId]);

    const handleCompleteBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/complete`, {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.id === bookingId ? { ...booking, status: 'complete' } : booking
                    )
                );
            } else {
                console.error('Error completing booking:', data.error);
            }
        } catch (error) {
            console.error('Error completing booking:', error);
        }
    };

    const handleRemoveBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setBookings((prevBookings) =>
                    prevBookings.filter((booking) => booking.id !== bookingId)
                );
            } else {
                console.error('Error removing booking:', data.error);
            }
        } catch (error) {
            console.error('Error removing booking:', error);
        }
    };

    return (
        <div className="my-bookings">
            <h2>My Bookings</h2>
            <div className="tabs">
                <button className={activeTab === 'Accepted' ? 'active' : ''} onClick={() => setActiveTab('Accepted')}>
                    Accepted
                </button>
                <button className={activeTab === 'Declined' ? 'active' : ''} onClick={() => setActiveTab('Declined')}>
                    Declined
                </button>
                <button className={activeTab === 'Complete' ? 'active' : ''} onClick={() => setActiveTab('Complete')}>
                    Complete
                </button>
            </div>
            <div className="bookings-list">
                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <div key={index} className="booking-item">
                            <p><strong>Route:</strong> {booking.origin} to {booking.destination}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Driver Name:</strong> {booking.username}</p>
                            <p><strong>Booked At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                            {booking.status === 'accepted' && (
                                <button onClick={() => handleCompleteBooking(booking.id)}>Complete</button>
                            )}
                            {booking.status === 'declined' && (
                                <button onClick={() => handleRemoveBooking(booking.id)}>Remove</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-bookings">No bookings available</p>
                )}
            </div>
        </div>
    );
};

export default MyBookings;

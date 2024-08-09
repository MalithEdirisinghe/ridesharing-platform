// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './DriverHome.css';
// import io from 'socket.io-client';
// import logo from '../assets/logo.jpg';

// const DriverHome = () => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         const loggedUser = JSON.parse(localStorage.getItem('user'));
//         console.log('Logged user:', loggedUser);  // Debugging line
//         if (loggedUser) {
//             setUser(loggedUser);

//             const socket = io('http://localhost:5000');
//             socket.emit('join', loggedUser.driverId);

//             socket.on('routeBooked', (notification) => {
//                 setNotifications((prevNotifications) => [...prevNotifications, notification]);
//             });

//             return () => socket.close();
//         } else {
//             navigate('/driver-login');
//         }
//     }, [navigate]);

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         navigate('/driver-login');
//     };

//     const handlePostRoute = () => {
//         navigate('/driver-route', { state: { driverId: user.driverId, driverName: user.username } }); // Pass driverId and driverName
//     };

//     if (!user) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="driver-home">
//             <header className="header">
//                 <div className="logo">
//                     <img src={logo} alt="Logo" className="logo-image" />
//                 </div>
//                 <nav className="nav-links">
//                     <a href="/">Home</a>
//                     <a href="/about">About Us</a>
//                     <a href="/contact">Contact</a>
//                     <a href="/available-cabs">Available Cabs</a>
//                     <button onClick={handleLogout} className="logout-button">Logout</button>
//                 </nav>
//             </header>
//             <main className="main-content">
//                 <h1>Driver Home</h1>
//                 <div className="welcome-box">
//                     <h2>Welcome, {user.username}!</h2>
//                     <p>Driver ID: {user.driverId}</p>
//                     {user.profilePicture && (
//                         <img
//                             src={`data:image/jpeg;base64,${user.profilePicture}`}
//                             alt="Profile"
//                             className="profile-picture"
//                         />
//                     )}
//                 </div>
//                 <button onClick={handlePostRoute} className="post-route-button">
//                     Post a Route
//                 </button>
//                 <div className="notifications">
//                     <h2>Notifications</h2>
//                     {notifications.length > 0 ? (
//                         notifications.map((notification, index) => (
//                             <div key={index} className="notification-item">
//                                 <p>{notification.message}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No new notifications</p>
//                     )}
//                 </div>
//             </main>
//             <footer className="footer">
//                 <p>© RP 2024 ~ Developed By: T.R. Piyumi Probodani</p>
//             </footer>
//         </div>
//     );
// };

// export default DriverHome;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverHome.css';
import io from 'socket.io-client';
import logo from '../assets/logo.jpg';

const DriverHome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [bookings, setBookings] = useState([]); // State to store bookings

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        console.log('Logged user:', loggedUser);  // Debugging line
        if (loggedUser) {
            setUser(loggedUser);

            const socket = io('http://localhost:5000');
            socket.emit('join', loggedUser.driverId);

            socket.on('routeBooked', (notification) => {
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
                // Fetch the latest bookings when a new booking is made
                fetchBookings(loggedUser.driverId);
            });

            return () => socket.close();
        } else {
            navigate('/driver-login');
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            fetchBookings(user.driverId);
        }
    }, [user]);

    const fetchBookings = async (driverId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings?driverId=${driverId}&status=pending`);
            const data = await response.json();
            if (response.ok) {
                setBookings(data.bookings);
            } else {
                console.error('Error fetching bookings:', data.error);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/driver-login');
    };

    const handlePostRoute = () => {
        navigate('/driver-route', { state: { driverId: user.driverId, driverName: user.username } }); // Pass driverId and driverName
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="driver-home">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
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
                <div className="notifications">
                    <h2>Notifications</h2>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification-item">
                                <p>{notification.message}</p>
                            </div>
                        ))
                    ) : (
                        <p>No new notifications</p>
                    )}
                </div>
                <div className="bookings">
                    <h2>Pending Bookings</h2>
                    {bookings.length > 0 ? (
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Client Name</th>
                                    <th>Route</th>
                                    <th>Booking Time</th>
                                    <th>Status</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.clientName}</td>
                                        <td>{`${booking.origin} to ${booking.destination}`}</td>
                                        <td>{new Date(booking.createdAt).toLocaleString()}</td>
                                        <td>{booking.status}</td>
                                        {/* Add more data as needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pending bookings</p>
                    )}
                </div>
            </main>
            {/* <footer className="footer">
                <p>© RP 2024 ~ Developed By: T.R. Piyumi Probodani</p>
            </footer> */}
        </div>
    );
};

export default DriverHome;

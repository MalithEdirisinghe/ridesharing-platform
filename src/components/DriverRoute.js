// import React, { useEffect, useState } from 'react';
// import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
// import './DriverRoute.css';

// const mapContainerStyle = {
//     width: '100%',
//     height: '400px',
// };

// const center = {
//     lat: 6.9271,
//     lng: 79.8612,
// };

// const DriverRoute = () => {
//     const [directionsResponse, setDirectionsResponse] = useState(null);
//     const [origin, setOrigin] = useState('');
//     const [destination, setDestination] = useState('');
//     const [message, setMessage] = useState('');
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const loggedUser = JSON.parse(localStorage.getItem('user'));
//         if (loggedUser) {
//             setUser(loggedUser);
//             console.log('Logged in user:', loggedUser);
//         }
//     }, []);

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!origin || !destination) {
//             setMessage('Please enter both origin and destination.');
//             return;
//         }

//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//             {
//                 origin: origin,
//                 destination: destination,
//                 travelMode: window.google.maps.TravelMode.DRIVING,
//             },
//             (result, status) => {
//                 if (status === window.google.maps.DirectionsStatus.OK) {
//                     setDirectionsResponse(result);
//                     postRoute(result);
//                 } else {
//                     console.error(`error fetching directions ${result}`);
//                 }
//             }
//         );
//     };

//     const postRoute = async (route) => {
//         if (!user) {
//             setMessage('User not logged in.');
//             return;
//         }

//         console.log('Posting route with driverId:', user.id);

//         try {
//             const response = await fetch('http://localhost:5000/api/routes', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     origin,
//                     destination,
//                     route,
//                     driverId: user.id,  // Send the driverId
//                     driverName: user.username
//                 })
//             });

//             const data = await response.json();
//             console.log('Server response:', data);

//             if (response.ok) {
//                 setMessage(data.message);
//             } else {
//                 setMessage(data.error);
//             }
//         } catch (error) {
//             console.error('Error posting route:', error);
//             setMessage('An error occurred during posting the route.');
//         }
//     };

//     return (
//         <div className="driver-route-page">
//             <h2>Post Your Route</h2>
//             {message && <p className="message">{message}</p>}
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Origin:
//                     <input
//                         type="text"
//                         value={origin}
//                         onChange={(e) => setOrigin(e.target.value)}
//                         placeholder="Enter origin"
//                         required
//                     />
//                 </label>
//                 <label>
//                     Destination:
//                     <input
//                         type="text"
//                         value={destination}
//                         onChange={(e) => setDestination(e.target.value)}
//                         placeholder="Enter destination"
//                         required
//                     />
//                 </label>
//                 <button type="submit">Get Route</button>
//             </form>
//             <LoadScript googleMapsApiKey="AIzaSyDW5IgT0-rJ4RzMHM61hXQQrxd2H1HZq0A">
//                 <GoogleMap
//                     mapContainerStyle={mapContainerStyle}
//                     center={center}
//                     zoom={10}
//                 >
//                     {directionsResponse && (
//                         <DirectionsRenderer
//                             directions={directionsResponse}
//                         />
//                     )}
//                 </GoogleMap>
//             </LoadScript>
//         </div>
//     );
// };

// export default DriverRoute;

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import './DriverRoute.css';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 6.9271,
    lng: 79.8612,
};

const DriverRoute = () => {
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
            console.log('Logged in user:', loggedUser);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!origin || !destination) {
            setMessage('Please enter both origin and destination.');
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
                    postRoute(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const postRoute = async (route) => {
        if (!user) {
            setMessage('User not logged in.');
            return;
        }

        console.log('Posting route with driverId:', user.driverId);

        try {
            const response = await fetch('http://localhost:5000/api/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin,
                    destination,
                    route,
                    driverId: user.driverId,  // Send the driverId
                    driverName: user.username
                })
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error posting route:', error);
            setMessage('An error occurred during posting the route.');
        }
    };

    return (
        <div className="driver-route-page">
            <h2>Post Your Route</h2>
            {message && <p className="message">{message}</p>}
            {user && (
                <div className="driver-info">
                    <p><strong>Driver Name:</strong> {user.username}</p>
                    <p><strong>Driver ID:</strong> {user.driverId}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    Origin:
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Enter origin"
                        required
                    />
                </label>
                <label>
                    Destination:
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter destination"
                        required
                    />
                </label>
                <button type="submit">Get Route</button>
            </form>
            <LoadScript googleMapsApiKey="AIzaSyDW5IgT0-rJ4RzMHM61hXQQrxd2H1HZq0A">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                >
                    {directionsResponse && (
                        <DirectionsRenderer
                            directions={directionsResponse}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default DriverRoute;

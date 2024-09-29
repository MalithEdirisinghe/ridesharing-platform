import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const directionsOptions = {
    polylineOptions: {
        strokeColor: '#0000FF',
    },
};

const RouteDetails = () => {
    const location = useLocation();
    const { route } = location.state || {};
    const [directions, setDirections] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (isMapLoaded && route) {
            const { origin, destination } = route;
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [isMapLoaded, route]);

    const handleBooking = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Client not logged in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    routeId: route.id,
                    clientId: user.clientId || user.id,  // Ensure clientId or id is correctly passed
                    driverId: route.driverId
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error booking route:', error);
            alert('An error occurred while booking the route.');
        }
    };


    if (!route) {
        return <div>Route details not available</div>;
    }

    return (
        <div>
            <h2>Route Details</h2>
            <p><strong>Driver Name:</strong> {route.driverName}</p>
            <p><strong>Driver ID:</strong> {route.driverId}</p>
            <p><strong>Origin:</strong> {route.origin}</p>
            <p><strong>Destination:</strong> {route.destination}</p>
            <button onClick={handleBooking}>Book Now</button>
            <LoadScript googleMapsApiKey="AIzaSyDW5IgT0-rJ4RzMHM61hXQQrxd2H1HZq0A" onLoad={() => setIsMapLoaded(true)}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: 6.9271, lng: 79.8612 }}
                    zoom={10}
                >
                    {directions && <DirectionsRenderer directions={directions} options={directionsOptions} />}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default RouteDetails;

// src/components/RideList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RideList = () => {
    const [rides, setRides] = useState([]);

    useEffect(() => {
        axios.get('/api/rides')
            .then(response => {
                setRides(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the ride data!", error);
            });
    }, []);

    return (
        <div>
            <h2>Available Rides</h2>
            <ul>
                {rides.map(ride => (
                    <li key={ride.id}>{ride.origin} to {ride.destination}</li>
                ))}
            </ul>
        </div>
    );
};

export default RideList;

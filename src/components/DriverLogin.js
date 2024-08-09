import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DriverLogin.css';

const DriverLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, userType: 'Driver' })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/driver-home', { state: { driverId: data.user.id, driverName: data.user.username } });
            } else {
                console.error(data.error);
                setMessage(data.error || 'An error occurred during login.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <div className="login-page">
            <h2>Driver Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default DriverLogin;

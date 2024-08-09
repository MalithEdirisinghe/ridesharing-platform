import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [userType, setUserType] = useState('Client');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setProfilePicturePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append('userType', userType);
        if (userType === 'Client' || userType === 'Driver') {
            formData.append('profilePicture', profilePicture);
            formData.append('username', username);
            formData.append('mobileNumber', mobileNumber);
        }
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                const user = {
                    id: data.id,
                    email: email,
                    username: username,
                    userType: userType
                };
                localStorage.setItem('user', JSON.stringify(user));
                navigate(userType === 'Client' ? '/client-login' : '/driver-login');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('An error occurred during registration.');
        }
    };

    return (
        <div className="register-page">
            <h2>Register</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    User Type:
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="Client">Client</option>
                        <option value="Driver">Driver</option>
                    </select>
                </label>
                {(userType === 'Client' || userType === 'Driver') && (
                    <>
                        <label>
                            Profile Picture:
                            <input
                                type="file"
                                onChange={handleProfilePictureChange}
                                required
                            />
                            {profilePicturePreview && (
                                <div className="profile-picture-preview">
                                    <img src={profilePicturePreview} alt="Profile Preview" />
                                </div>
                            )}
                        </label>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </label>
                        <label>
                            Mobile Number:
                            <input
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="Enter your mobile number"
                                required
                            />
                        </label>
                    </>
                )}
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;

import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = ({ isLoggedIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(''); 

    const handleSOS = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/sos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                console.log('SOS message sent successfully');
                setStatus('SOS message sent successfully!');
            } else {
                console.error('Error sending SOS message');
                setStatus('Failed to send SOS message.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Failed to send SOS message.');
        }

        // Reset form
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="contact-us-page">
            <div className="contact-us">
                <header className="header">
                    <h1>Contact Us</h1>
                </header>
                <section className="content">
                    <form onSubmit={handleSOS}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Your Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <button type="submit" className="sos-button">Send SOS</button>
                    </form>
                    {status && <p className="status-message">{status}</p>}
                </section>
            </div>
        </div>
    );
};

export default ContactUs;

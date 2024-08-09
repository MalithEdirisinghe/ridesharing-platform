import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <div className="about-us">
                <header className="header">
                    <h1>About Us</h1>
                </header>
                <section className="content">
                    <p>Welcome to our Ridesharing Platform! We aim to provide a cost-effective, efficient, and eco-friendly transportation solution for daily commuters. Our mission is to connect drivers and passengers with similar travel routes to optimize resources, reduce travel costs, and foster community connections.</p>

                    <h2>Who We Are</h2>
                    <p>We are a team of technology and transportation enthusiasts committed to transforming commutes. Our goal is to create a platform that makes daily travel more convenient and affordable.</p>

                    <h2>Our Vision</h2>
                    <p>To revolutionize commutes by offering a seamless ridesharing experience that reduces traffic congestion and carbon emissions while building a connected community.</p>

                    <h2>What We Offer</h2>
                    <ul>
                        <li><strong>Efficient Ride Matching:</strong> Advanced routing algorithms for quick and efficient matching.</li>
                        <li><strong>Cost Savings:</strong> Shared rides reduce travel expenses for passengers and provide extra income for drivers.</li>
                        <li><strong>Safety and Security:</strong> Robust user verification and a secure platform.</li>
                        <li><strong>User-Friendly Interface:</strong> Intuitive design for easy ride booking and management.</li>
                        <li><strong>Community Building:</strong> Creating a social commuting experience.</li>
                    </ul>

                    <h2>Join Us</h2>
                    <p>Drivers can share rides and earn extra income, while passengers enjoy affordable and convenient travel. Join our community today for a better commuting experience.</p>

                    <p>Thank you for choosing our Ridesharing Platform. Together, we can make a difference in how we travel and connect.</p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;

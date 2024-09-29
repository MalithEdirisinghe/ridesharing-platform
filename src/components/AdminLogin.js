// // src/components/AdminLogin.js
// import React, { useState } from 'react';

// const AdminLogin = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle admin login logic here
//         console.log('Admin login:', email, password);
//     };

//     return (
//         <div>
//             <h2>Admin Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                alert('Login failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="admin-login">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
        </div>
    );
};

export default AdminLogin;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoaInbox from './pages/DoaInbox';
import SendDoa from './pages/SendDoa';
import Journey from './pages/Journey';
import LandingPage from './pages/LandingPage';

// Handles Google login callback
function GoogleCallback({ onLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const uniqueLink = params.get('uniqueLink');
        const hasSeenOnboarding = params.get('hasSeenOnboarding');

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('uniqueLink', uniqueLink);
            localStorage.setItem('hasSeenOnboarding', hasSeenOnboarding);
            onLogin();
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <p style={{ color: '#4A5A2C', textAlign: 'center', marginTop: '40vh', fontSize: '18px' }}>
            Loading... 🕋
        </p>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('token')
    );

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* 🌟 Landing page — shown to everyone at / */}
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? <Navigate to="/dashboard" />
                            : <LandingPage onGetStarted={() => window.location.href = '/login'} />
                    }
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn
                            ? <Navigate to="/dashboard" />
                            : <Login onLogin={handleLogin} onSwitchToRegister={() => window.location.href = '/register'} />
                    }
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={
                        isLoggedIn
                            ? <Navigate to="/dashboard" />
                            : <Register
                                onRegister={handleLogin}
                                onSwitchToLogin={() => window.location.href = '/login'}
                            />
                    }
                />

                {/* Google OAuth callback */}
                <Route
                    path="/auth/callback"
                    element={<GoogleCallback onLogin={handleLogin} />}
                />

                {/* Public sender route — no login needed */}
                <Route
                    path="/send/:uniqueLink"
                    element={<SendDoa />}
                />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/inbox"
                    element={isLoggedIn ? <DoaInbox /> : <Navigate to="/login" />}
                />
                <Route
                    path="/journey"
                    element={isLoggedIn ? <Journey /> : <Navigate to="/login" />}
                />

                {/* Catch all → landing */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
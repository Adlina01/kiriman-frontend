import React, { useState, useEffect } from 'react';
import { login } from '../services/api';

function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Sila isi semua maklumat');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await login(email, password);
            const { token, name, uniqueLink, email: userEmail, hasSeenOnboarding } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('uniqueLink', uniqueLink);
            localStorage.setItem('hasSeenOnboarding', hasSeenOnboarding);
            onLogin();
        } catch (err) {
            setError('Email atau kata laluan tidak sah');
        }
        setLoading(false);
    };

    const handleGoogleLogin = () => {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        window.location.href = `${API_URL}/oauth2/authorization/google`;
    };

    return (
        <div style={styles.container}>
            {/* LEFT SIDE — Decorative panel (desktop only) */}
            {isDesktop && (
                <div style={styles.leftPanel}>
                    {/* Decorative circles */}
                    <div style={styles.bigCircle1}></div>
                    <div style={styles.bigCircle2}></div>

                    {/* Hero content */}
                    <div style={styles.heroContent}>
                        <div style={styles.heroLogo}>🕋</div>
                        <h1 style={styles.heroTitle}>Kiriman</h1>
                        <p style={styles.heroTagline}>Setiap kiriman adalah amanah yang dibawa</p>

                    </div>
                </div>
            )}

            {/* RIGHT SIDE — Login form */}
            <div style={isDesktop ? styles.rightPanel : styles.mobileContainer}>
                {/* Mobile-only decorations */}


                <div style={styles.loginCard}>
                    <div style={styles.logoIcon}>🕋</div>
                    <h2 style={styles.title}>Log Masuk</h2>
                    <p style={styles.tagline}>urus doa dan perjalanan umrah anda di sini</p>

                    {error && <p style={styles.error}>{error}</p>}

                    <button style={styles.googleBtn} onClick={handleGoogleLogin}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>atau</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Kata laluan"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button style={styles.loginBtn} onClick={handleLogin} disabled={loading}>
                        {loading ? 'Sedang masuk...' : 'Log Masuk'}
                    </button>

                    <p style={styles.switchText}>
                        Belum ada akaun?{' '}
                        <span style={styles.switchLink} onClick={onSwitchToRegister}>
                            Daftar di sini
                        </span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes compassSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes planeFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        width: '100%',
    },

    // 🖥️ DESKTOP LEFT PANEL (decorative)
    leftPanel: {
        flex: 1,
        position: 'relative',
        background: `
            radial-gradient(ellipse at top, #DDE0C8 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, #4A5A2C 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, #7A8B5A 0%, transparent 60%),
            linear-gradient(135deg, #F4F1E8 0%, #C9C9A8 50%, #7A8B5A 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '40px',
    },
    bigCircle1: {
        position: 'absolute',
        top: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 90, 44, 0.15), transparent 70%)',
    },
    bigCircle2: {
        position: 'absolute',
        bottom: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 61, 20, 0.15), transparent 70%)',
    },
    compassLarge: {
        position: 'absolute',
        top: '40px',
        right: '40px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '3px solid rgba(74, 90, 44, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        animation: 'compassSpin 8s linear infinite',
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '500px',
    },
    heroLogo: {
        width: '90px',
        height: '90px',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '44px',
        boxShadow: '0 12px 32px rgba(74, 90, 44, 0.4)',
    },
    heroTitle: {
        fontSize: '52px',
        fontWeight: '800',
        color: '#2D3D14',
        margin: '0 0 12px 0',
        letterSpacing: '-1px',
    },
    heroTagline: {
        fontSize: '18px',
        color: '#5A6B3A',
        fontStyle: 'italic',
        margin: '0 0 40px 0',
        lineHeight: '1.5',
    },
    heroRoute: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    heroRouteItem: {
        textAlign: 'center',
    },
    heroPin: {
        fontSize: '32px',
        marginBottom: '6px',
    },
    heroRouteLabel: {
        fontSize: '12px',
        color: '#2D3D14',
        fontWeight: '600',
    },
    heroRouteLine: {
        flex: 1,
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '8px 2px',
        backgroundRepeat: 'repeat-x',
        maxWidth: '60px',
    },
    heroRoutePlane: {
        fontSize: '28px',
        animation: 'planeFloat 3s ease-in-out infinite',
    },
    heroQuote: {
        color: '#4A5A2C',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: 0,
    },

    // 🖥️ DESKTOP RIGHT PANEL (form)
    rightPanel: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAF5',
        padding: '40px',
        position: 'relative',
    },

    // 📱 MOBILE CONTAINER
    mobileContainer: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        background: `
            radial-gradient(ellipse at top, #DDE0C8 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, #4A5A2C 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, #7A8B5A 0%, transparent 60%),
            linear-gradient(135deg, #F4F1E8 0%, #C9C9A8 50%, #7A8B5A 100%)
        `,
    },
    compassDecoration: {
        position: 'absolute',
        top: '40px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(74, 90, 44, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        animation: 'compassSpin 8s linear infinite',
        zIndex: 1,
    },
    circle1: {
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 90, 44, 0.15), transparent 70%)',
    },
    circle2: {
        position: 'absolute',
        bottom: '-120px',
        right: '-120px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45, 61, 20, 0.15), transparent 70%)',
    },

    // ✨ Login card (responsive)
    loginCard: {
        position: 'relative',
        zIndex: 2,
        background: '#FFFFFF',
        border: '1px solid #E5E5D8',
        borderRadius: '24px',
        padding: '40px 32px 28px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(74, 90, 44, 0.15)',
        width: '100%',
        maxWidth: '440px',
    },
    logoIcon: {
        width: '70px',
        height: '70px',
        margin: '0 auto 16px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '32px',
        boxShadow: '0 8px 20px rgba(74, 90, 44, 0.3)',
    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
        color: '#2D3D14',
        margin: '0 0 4px 0',
    },
    tagline: {
        color: '#7A8B5A',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: '0 0 20px 0',
    },
    routeMini: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px',
        background: '#F4F1E8',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '20px',
    },
    routePin: { fontSize: '20px' },
    routePlane: { fontSize: '20px' },
    routeDash: {
        flex: 1,
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '6px 2px',
        backgroundRepeat: 'repeat-x',
    },
    error: {
        color: '#c62828',
        fontSize: '13px',
        margin: '0 0 12px 0',
        padding: '8px 12px',
        background: 'rgba(198, 40, 40, 0.1)',
        borderRadius: '8px',
    },
    googleBtn: {
        width: '100%',
        padding: '12px',
        background: 'white',
        color: '#444',
        border: '1px solid #E5E5D8',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '12px 0',
    },
    dividerLine: { flex: 1, height: '1px', background: '#E5E5D8' },
    dividerText: { color: '#9CA890', fontSize: '11px' },
    input: {
        width: '100%',
        padding: '12px 14px',
        margin: '6px 0',
        borderRadius: '10px',
        border: '1px solid #E5E5D8',
        fontSize: '14px',
        background: '#F4F1E8',
        color: '#2D3D14',
        boxSizing: 'border-box',
        outline: 'none',
    },
    loginBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.25)',
    },
    switchText: {
        fontSize: '13px',
        color: '#7A8B5A',
        marginTop: '14px',
    },
    switchLink: {
        color: '#4A5A2C',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default Login;
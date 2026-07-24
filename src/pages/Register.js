import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '../services/api';

function Register({ onRegister, onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleRegister = async () => {
        //  Empty field check
        if (!name || !email || !password) {
            setError('Sila isi semua maklumat');
            return;
        }
        // Name too short
        if (name.trim().length < 3) {
            setError('Nama mestilah sekurang-kurangnya 3 huruf');
            return;
        }
        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Format email tidak sah');
            return;
        }
        // ✅ Password length check
        if (password.length < 6) {
            setError('Kata laluan mestilah sekurang-kurangnya 6 aksara');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await register(name, email, password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('name', response.data.name);
            localStorage.setItem('uniqueLink', response.data.uniqueLink);
            localStorage.setItem('hasSeenOnboarding', response.data.hasSeenOnboarding);
            onRegister();
        } catch (err) {
            setError('Pendaftaran gagal! Email mungkin sudah digunakan.');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            {/* LEFT PANEL — Desktop only */}
            {isDesktop && (
                <div style={styles.leftPanel}>
                    <div style={styles.bigCircle1}></div>
                    <div style={styles.bigCircle2}></div>

                    <div style={styles.heroContent}>
                        <div style={styles.heroLogo}>🕋</div>
                        <h1 style={styles.heroTitle}>Kiriman</h1>
                        <p style={styles.heroTagline}>Setiap kiriman adalah amanah yang dibawa</p>

                    </div>
                </div>
            )}

            {/* RIGHT PANEL — Form */}
            <div style={isDesktop ? styles.rightPanel : styles.mobileContainer}>
                {/* Mobile decorations */}
                {!isDesktop && (
                    <>

                    </>
                )}

                <div style={styles.card}>
                    <div style={styles.logoIcon}>🕋</div>

                    <h2 style={styles.title}>Daftar Akaun</h2>
                    <p>{/*style={styles.subtitle}>Daftar sebagai Jemaah Umrah*/}</p>

                    {error && <p style={styles.error}>{error}</p>}

                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Nama penuh"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    {/* Password with show/hide eye button */}
                    <div style={styles.passwordWrap}>
                        <input
                            style={styles.passwordInput}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Kata Laluan"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            style={styles.eyeBtn}
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                        >
                            {showPassword ? <EyeOff size={20} color="#7A8B5A" /> : <Eye size={20} color="#7A8B5A" />}
                        </button>
                    </div>
                    <p style={styles.passwordHint}>Sekurang-kurangnya 6 aksara</p>

                    <button style={styles.button} onClick={handleRegister} disabled={loading}>
                        {loading ? 'Mendaftar...' : 'Daftar Akaun'}
                    </button>

                    <p style={styles.link}>
                        Sudah ada akaun?{' '}
                        <span style={styles.linkSpan} onClick={onSwitchToLogin}>
                            Log masuk di sini
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

    // 🖥️ DESKTOP LEFT PANEL
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
    heroRouteItem: { textAlign: 'center' },
    heroPin: { fontSize: '32px', marginBottom: '6px' },
    heroRouteLabel: { fontSize: '12px', color: '#2D3D14', fontWeight: '600' },
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

    // 🖥️ DESKTOP RIGHT PANEL
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

    // ✨ Card
    card: {
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
    subtitle: {
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
        textAlign: 'left',
    },
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
        fontFamily: 'inherit',
    },

    // 👁️ Password show/hide
    passwordWrap: {
        position: 'relative',
        width: '100%',
        margin: '6px 0',
    },
    passwordInput: {
        width: '100%',
        padding: '12px 44px 12px 14px',
        borderRadius: '10px',
        border: '1px solid #E5E5D8',
        fontSize: '14px',
        background: '#F4F1E8',
        color: '#2D3D14',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    passwordHint: {
        fontSize: '11px',
        color: '#9CA890',
        textAlign: 'left',
        margin: '0 0 6px 4px',
    },

    button: {
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
    link: {
        fontSize: '13px',
        color: '#7A8B5A',
        marginTop: '14px',
    },
    linkSpan: {
        color: '#4A5A2C',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default Register;
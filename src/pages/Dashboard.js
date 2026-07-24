import React, { useState, useEffect } from 'react';
import { getJourney, getDoaStats, saveJourney, markOnboardingSeen } from '../services/api';
import { Link, CircleCheckBig, Inbox,Plane,FileCheck,Clock, MessageCircle, Send, Copy, Check, X } from 'lucide-react';

function AnimatedNumber({ value, duration = 1200 }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (value === undefined || value === null) return;
        const target = Number(value);
        if (isNaN(target)) return;

        const startTime = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        let animationFrameId;
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const currentValue = Math.round(target * easedProgress);
            setDisplay(currentValue);
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [value, duration]);

    return <>{display}</>;
}

function Dashboard({ onLogout }) {
    const [journey, setJourney] = useState(null);
    const [stats, setStats] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingForm, setOnboardingForm] = useState({ departureDate: '', returnDate: '', departureCity: '' });
    const [onboardingSaving, setOnboardingSaving] = useState(false);
    const [onboardingError, setOnboardingError] = useState('');
    const name = localStorage.getItem('name');
    const uniqueLink = localStorage.getItem('uniqueLink');

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (localStorage.getItem('hasSeenOnboarding') === 'false') {
            setShowOnboarding(true);
        }
    }, []);

    useEffect(() => {
        fetchData(); // initial load
        const interval = setInterval(fetchData, 5000); // poll every 15s
        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    const fetchData = async () => {
        try {
            const journeyRes = await getJourney();
            setJourney(journeyRes.data);
        } catch (err) {
            console.log('No journey set yet');
        }
        try {
            const statsRes = await getDoaStats();
            setStats(statsRes.data);
        } catch (err) {
            console.log('No stats yet');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        onLogout();
    };

    const handleOnboardingSubmit = async () => {
        if (!onboardingForm.departureDate || !onboardingForm.returnDate) {
            setOnboardingError('Sila isi kedua-dua tarikh');
            return;
        }
        setOnboardingSaving(true);
        setOnboardingError('');
        try {
            await saveJourney(onboardingForm.departureDate, onboardingForm.returnDate, onboardingForm.departureCity);
            await markOnboardingSeen();
            localStorage.setItem('hasSeenOnboarding', 'true');
            setShowOnboarding(false);
            fetchData();
        } catch (err) {
            setOnboardingError('Gagal simpan maklumat. Cuba lagi.');
        }
        setOnboardingSaving(false);
    };

    const handleOnboardingSkip = async () => {
        try {
            await markOnboardingSeen();
        } catch (err) {
            console.log('Failed to mark onboarding seen');
        }
        localStorage.setItem('hasSeenOnboarding', 'true');
        setShowOnboarding(false);
    };

    const fullLink = `${window.location.origin}/send/${uniqueLink}`;
    const shareMessage = `Assalamualaikum! Saya akan menunaikan Umrah, In Sha Allah. Ini link jika hendak kirimkan doa :\n\n${fullLink}\n\nDoakan perjalanan saya dipermudahkan.`;

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
        setShareModalOpen(false);
    };

    const handleTelegram = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(fullLink)}&text=${encodeURIComponent('Sila kirim doa anda di sini.')}`, '_blank');
        setShareModalOpen(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fullLink);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShareModalOpen(false);
        }, 1500);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShareModalOpen(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mapBg}></div>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>🕋</div>
                        <div style={styles.logoText}>Kiriman</div>
                    </div>
                    <div style={styles.headerRight}>
                        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>

            {/* Content - max width for desktop */}
            <div style={styles.content}>
                <div style={styles.welcome}>
                    <h2 style={styles.welcomeTitle}>Assalamualaikum, {name} </h2>
                    <p style={styles.subtitle}>Semoga perjalanan anda diberkati Allah</p>
                </div>

                {/* 1️⃣ HERO — Full width Journey Card */}
                {journey ? (
                    <div style={styles.journeyCard}>
                        <div style={styles.journeyDecoration}></div>
                        <div style={isDesktop ? styles.journeyCardInner : styles.mobileStack}>

                            {/* Left — Route + Progress */}
                            <div style={styles.journeyLeft}>
                                <div style={styles.stageLabel}>~ Menuju ke Baitullah ~</div>
                                <div style={styles.routeContainer}>
                                    <div style={styles.pinStart}>📍</div>
                                    <div style={styles.routeLine}></div>
                                    <div style={styles.plane}>✈️</div>
                                    <div style={styles.pinEnd}>🕋</div>
                                    <div style={styles.routeLabelStart}>{journey.departureCity || 'KL'}</div>
                                    <div style={styles.routeLabelEnd}>MAKKAH</div>
                                </div>

                            </div>

                            {/* Right — Big countdown */}
                            <div style={styles.journeyRight}>
                                <div style={{
                                    ...styles.distanceNum,
                                    fontSize: isDesktop ? '96px' : '72px',
                                }}>
                                    <AnimatedNumber value={journey.countdown} duration={1500} />
                                </div>
                                <div style={styles.distanceLabel}>hari lagi </div>
                                <div style={styles.distanceMessage}>{journey.message}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.emptyStateCard}>

                        <p style={styles.emptyStateTitle}>Dashboard anda masih kosong</p>
                        <p style={styles.emptyStateSubtitle}>Isi maklumat perjalanan untuk lihat baki hari ke Tanah Suci</p>
                        <button style={styles.emptyStateBtn} onClick={() => setShowOnboarding(true)}>
                            + Isi maklumat perjalanan
                        </button>
                    </div>
                )}

                {/* 2️⃣ STATS ROW — 3 columns full width */}
                {stats && (
                    <div style={{
                        ...styles.statsGrid,
                        gap: isDesktop ? '16px' : '10px',
                    }}>
                        <div style={styles.pinStat}>
                            <div style={styles.pinIconWrapper}><FileCheck size={24} /></div>
                            <div style={styles.pinStatNum}>
                                <AnimatedNumber value={stats.total} duration={1000} />
                            </div>
                            <div style={styles.pinStatLabel}>Doa Diterima</div>
                        </div>
                        <div style={styles.pinStat}>
                            <div style={styles.pinIconWrapper}><CircleCheckBig size={23}/></div>
                            <div style={styles.pinStatNum}>
                                <AnimatedNumber value={stats.recited} duration={1100} />
                            </div>
                            <div style={styles.pinStatLabel}>Sudah Dibaca</div>
                        </div>

                        <div style={styles.pinStat}>
                            <div style={styles.pinIconWrapper}><Clock size={24}/></div>
                            <div style={styles.pinStatNum}>
                                <AnimatedNumber value={stats.pending} duration={1200} />
                            </div>
                            <div style={styles.pinStatLabel}>Belum Dibaca</div>
                        </div>
                    </div>
                )}

                {/* 3️⃣ BOTTOM — Invite + Nav */}
                <div style={isDesktop ? styles.bottomGrid : styles.mobileStack}>

                    {/* Invitation Card */}
                    <div style={styles.invitationCard}>
                        <div style={styles.invitationAccent}></div>
                        <div style={styles.invitationHeader}>
                            <div style={styles.invitationIcon}><Link/></div>
                            <div style={styles.invitationTitle}>Link Doa</div>
                        </div>
                        <p style={styles.invitationSubtitle}>Kongsikan kepada sesiapa yang ingin kirimkan doa</p>
                        <div style={styles.linkDisplay}>{fullLink}</div>
                        <button style={styles.inviteBtn} onClick={() => setShareModalOpen(true)}>
                            <span>Kongsi</span>
                        </button>
                    </div>

                    {/* Destinations */}
                    <div style={styles.destinations}>
                        <a href="/inbox" style={styles.destination}>
                            <div style={styles.destIcon}><Inbox size={24} /></div>
                            <div style={styles.destText}>
                                <div style={styles.destName}>Kiriman Doa</div>
                            </div>
                            <div style={styles.destArrow}>›</div>
                        </a>
                        <a href="/journey" style={styles.destination}>
                            <div style={styles.destIcon}><Plane size={24}/></div>
                            <div style={styles.destText}>
                                <div style={styles.destName}>Kemaskini Perjalanan</div>
                            </div>
                            <div style={styles.destArrow}>›</div>
                        </a>
                    </div>
                </div>

                <p style={styles.footerQuote}>
                    "Setiap kiriman adalah amanah yang dibawa"
                </p>
            </div>

            {/* Glass Share Modal */}
            {shareModalOpen && (
                <div style={styles.modalOverlay} onClick={handleOverlayClick}>
                    <div style={styles.modalCard}>
                        <button style={styles.modalCloseBtn} onClick={() => setShareModalOpen(false)}><X size={18} /></button>
                        <h3 style={styles.modalTitle}>Pilih cara untuk berkongsi</h3>
                        <p></p>

                        <div style={styles.shareOptions}>
                            <button style={styles.shareOption} onClick={handleWhatsApp}>
                                <div style={{ ...styles.shareOptionIcon, background: 'linear-gradient(135deg, #25D366, #128C7E)' }}><MessageCircle size={20} color="white" /></div>
                                <div style={styles.shareOptionLabel}>
                                    <div style={styles.shareOptionName}>WhatsApp</div>
                                    <div style={styles.shareOptionDesc}>Kongsikan kepada kawan</div>
                                </div>
                                <span style={styles.shareOptionArrow}>›</span>
                            </button>

                            <button style={styles.shareOption} onClick={handleTelegram}>
                                <div style={{ ...styles.shareOptionIcon, background: 'linear-gradient(135deg, #0088cc, #006699)' }}><Send size={20} color="white" /></div>
                                <div style={styles.shareOptionLabel}>
                                    <div style={styles.shareOptionName}>Telegram</div>
                                    <div style={styles.shareOptionDesc}>Kongsikan ke dalam group</div>
                                </div>
                                <span style={styles.shareOptionArrow}>›</span>
                            </button>

                            <button
                                style={{
                                    ...styles.shareOption,
                                    background: copied ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.6)',
                                    borderColor: copied ? '#4caf50' : 'rgba(255, 255, 255, 0.5)',
                                }}
                                onClick={handleCopy}
                            >
                                <div style={{ ...styles.shareOptionIcon, background: copied ? '#4caf50' : 'linear-gradient(135deg, #4A5A2C, #2D3D14)' }}>
                                    {copied ? <Check size={20} color="white" /> : <Copy size={20} color="white" />}
                                </div>
                                <div style={styles.shareOptionLabel}>
                                    <div style={styles.shareOptionName}>{copied ? 'Link Disalin!' : 'Salin Link'}</div>
                                    <div style={styles.shareOptionDesc}>{copied ? 'Boleh paste di mana-mana' : 'Salin ke clipboard'}</div>
                                </div>
                                <span style={styles.shareOptionArrow}>›</span>
                            </button>
                        </div>

                        <button style={styles.modalCancelBtn} onClick={() => setShareModalOpen(false)}>Tutup</button>
                    </div>
                </div>
            )}

            {/* Onboarding Modal */}
            {showOnboarding && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitle}>Lengkapkan maklumat perjalanan anda </h3>
                        <p style={styles.modalSubtitle}>Isi maklumat perjalanan untuk mengaktifkan dashboard anda.</p>

                        {onboardingError && <p style={styles.error}>{onboardingError}</p>}

                        <label style={styles.onboardingLabel}>Bandar berlepas</label>
                        <input
                            style={styles.onboardingInput}
                            type="text"
                            placeholder="Contoh: Kuala Lumpur"
                            value={onboardingForm.departureCity}
                            onChange={e => setOnboardingForm({ ...onboardingForm, departureCity: e.target.value })}
                        />

                        <label style={styles.onboardingLabel}>Tarikh berlepas</label>
                        <input
                            style={styles.onboardingInput}
                            type="date"
                            value={onboardingForm.departureDate}
                            onChange={e => setOnboardingForm({ ...onboardingForm, departureDate: e.target.value })}
                        />

                        <label style={styles.onboardingLabel}>Tarikh pulang</label>
                        <input
                            style={styles.onboardingInput}
                            type="date"
                            value={onboardingForm.returnDate}
                            onChange={e => setOnboardingForm({ ...onboardingForm, returnDate: e.target.value })}
                        />

                        <button style={styles.onboardingSubmitBtn} onClick={handleOnboardingSubmit} disabled={onboardingSaving}>
                            {onboardingSaving ? 'Menyimpan...' : 'Simpan dan lihat dashboard'}
                        </button>
                        <button style={styles.modalCancelBtn} onClick={handleOnboardingSkip}>
                            Isi kemudian
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes compassSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes planeFloat {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-4px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInModal {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#FAFAF5',
        color: '#2D3D14',
        position: 'relative',
        width: '100%',
    },
    mapBg: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(74, 90, 44, 0.025) 30px, rgba(74, 90, 44, 0.025) 31px),
            repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(74, 90, 44, 0.025) 30px, rgba(74, 90, 44, 0.025) 31px)
        `,
        pointerEvents: 'none',
    },

    header: {
        position: 'relative',
        zIndex: 10,
        background: '#FAFAF5',
        borderBottom: '1px solid #E5E5D8',
        padding: '0 20px',
    },
    headerInner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 0',
        maxWidth: '1100px',
        margin: '0 auto',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: {
        width: '36px',
        height: '36px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        color: 'white',
    },
    logoText: { fontSize: '18px', fontWeight: '700', color: '#2D3D14' },
    headerRight: { display: 'flex', gap: '8px', alignItems: 'center' },
    compassBtn: {
        width: '36px',
        height: '36px',
        background: '#FAFAF5',
        border: '2px solid #4A5A2C',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#4A5A2C',
        animation: 'compassSpin 8s linear infinite',
    },
    logoutBtn: {
        padding: '8px 16px',
        background: 'transparent',
        color: '#7A8B5A',
        border: '1px solid #E5E5D8',
        borderRadius: '10px',
        fontSize: '13px',
        cursor: 'pointer',
    },

    content: {
        position: 'relative',
        zIndex: 5,
        padding: '24px 20px',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },

    welcome: {
        textAlign: 'center',
        marginBottom: '0',
    },
    welcomeTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2D3D14',
        margin: '0 0 4px 0',
    },
    subtitle: {
        color: '#7A8B5A',
        fontSize: '14px',
        fontStyle: 'italic',
        margin: 0,
    },

    journeyCardInner: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'center',
    },
    journeyLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    journeyRight: {
        textAlign: 'center',
        padding: '16px 0',
    },
    bottomGrid: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '16px',
        alignItems: 'start',
    },
    mobileStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },

    journeyCard: {
        background: 'linear-gradient(135deg, #FAFAF5 0%, #F4F1E8 100%)',
        border: '1px solid #E5E5D8',
        borderRadius: '24px',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '0',
    },
    journeyDecoration: {
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(74, 90, 44, 0.06), transparent 70%)',
        borderRadius: '50%',
    },
    stageLabel: {
        textAlign: 'center',
        fontSize: '11px',
        letterSpacing: '3px',
        color: '#7A8B5A',
        marginBottom: '16px',
        fontWeight: '600',
    },
    routeContainer: {
        position: 'relative',
        margin: '24px 0 20px',
        height: '60px',
    },
    routeLabelStart: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        fontSize: '11px',
        color: '#7A8B5A',
        fontWeight: '600',
    },
    routeLabelEnd: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: '11px',
        color: '#7A8B5A',
        fontWeight: '600',
    },
    routeLine: {
        position: 'absolute',
        top: '22px',
        left: '30px',
        right: '30px',
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '10px 2px',
        backgroundRepeat: 'repeat-x',
    },
    pinStart: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '44px',
        height: '44px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.3)',
    },
    pinEnd: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '44px',
        height: '44px',
        background: 'linear-gradient(135deg, #2D3D14, #4A5A2C)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.3)',
    },
    plane: {
        position: 'absolute',
        top: '12px',
        left: '50%',
        fontSize: '26px',
        zIndex: 3,
        animation: 'planeFloat 3s ease-in-out infinite',
        filter: 'drop-shadow(0 2px 4px rgba(74, 90, 44, 0.3))',
    },
    distance: {
        textAlign: 'center',
        marginTop: '12px',
    },
    distanceNum: {
        fontSize: '96px',
        fontWeight: '800',
        lineHeight: '1',
        background: 'linear-gradient(135deg, #4A5A2C, #7A8B5A)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '8px',
    },
    distanceLabel: {
        color: '#2D3D14',
        fontSize: '20px',
        fontWeight: '600',
    },
    distanceMessage: {
        color: '#7A8B5A',
        fontSize: '13px',
        fontStyle: 'italic',
        marginTop: '8px',
    },
    progressContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
        padding: '12px 18px',
        background: 'rgba(74, 90, 44, 0.06)',
        borderRadius: '999px',
    },
    progressLabel: {
        fontSize: '11px',
        color: '#7A8B5A',
        fontWeight: '600',
        letterSpacing: '1px',
    },
    progressBar: {
        flex: 1,
        height: '6px',
        background: '#DDE0C8',
        borderRadius: '999px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A)',
        borderRadius: '999px',
        transition: 'width 1s ease',
    },
    progressPercent: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#4A5A2C',
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
    },
    pinStat: {
        background: '#FAFAF5',
        border: '1px solid #E5E5D8',
        borderRadius: '16px',
        padding: '20px 8px',
        textAlign: 'center',
        transition: 'all 0.3s',
    },
    pinIconWrapper: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #C9C9A8, #DDE0C8)',
        borderRadius: '10px',
        margin: '0 auto 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    pinStatNum: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#4A5A2C',
        lineHeight: '1',
        marginBottom: '4px',
    },
    pinStatLabel: {
        fontSize: '10px',
        color: '#7A8B5A',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },

    invitationCard: {
        background: '#FAFAF5',
        border: '1px solid #E5E5D8',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
    },
    invitationAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A, #C9C9A8)',
    },
    invitationHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
    },
    invitationIcon: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #C9C9A8, #DDE0C8)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    invitationTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2D3D14',
    },
    invitationSubtitle: {
        color: '#7A8B5A',
        fontSize: '13px',
        marginBottom: '14px',
    },
    linkDisplay: {
        background: '#F4F1E8',
        border: '1px dashed #C9C9A8',
        borderRadius: '10px',
        padding: '12px 14px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#4A5A2C',
        marginBottom: '14px',
        wordBreak: 'break-all',
    },
    inviteBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.25)',
    },

    destinations: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    destination: {
        background: '#FAFAF5',
        border: '1px solid #E5E5D8',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        color: '#2D3D14',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    destIcon: {
        width: '44px',
        height: '44px',
        background: 'linear-gradient(135deg, #C9C9A8, #DDE0C8)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    destText: { flex: 1 },
    destName: { fontWeight: '600', fontSize: '14px', color: '#2D3D14' },
    destDesc: { fontSize: '12px', color: '#7A8B5A', marginTop: '2px' },
    destArrow: { fontSize: '20px', color: '#7A8B5A' },

    footerQuote: {
        textAlign: 'center',
        color: '#9CA890',
        fontSize: '12px',
        fontStyle: 'italic',
        padding: '24px',
        marginTop: '8px',
    },

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(45, 61, 20, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
    },
    modalCard: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: '24px',
        padding: '28px 24px 20px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(45, 61, 20, 0.3)',
        animation: 'slideInModal 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        background: 'rgba(245, 245, 240, 0.8)',
        border: '1px solid rgba(74, 90, 44, 0.1)',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#7A8B5A',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        margin: 0,
        color: '#2D3D14',
        fontSize: '20px',
        textAlign: 'center',
        fontWeight: '700',
    },
    modalSubtitle: {
        margin: '8px 0 24px',
        color: '#7A8B5A',
        fontSize: '13px',
        textAlign: 'center',
    },
    shareOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px',
    },
    shareOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '14px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
    },
    shareOptionIcon: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        color: 'white',
        flexShrink: 0,
    },
    shareOptionLabel: { flex: 1 },
    shareOptionName: { color: '#2D3D14', fontWeight: '600', fontSize: '14px' },
    shareOptionDesc: { color: '#7A8B5A', fontSize: '11px', marginTop: '2px' },
    shareOptionArrow: { color: '#7A8B5A', fontSize: '22px', fontWeight: '300' },
    modalCancelBtn: {
        width: '100%',
        padding: '12px',
        background: 'rgba(74, 90, 44, 0.05)',
        color: '#7A8B5A',
        border: '1px solid #E5E5D8',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },

    emptyStateCard: {
        background: '#FAFAF5',
        border: '1px dashed #C9C9A8',
        borderRadius: '20px',
        padding: '32px 24px',
        textAlign: 'center',
    },
    emptyStateIcon: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C9C9A8, #DDE0C8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        margin: '0 auto 14px',
    },
    emptyStateTitle: {
        fontWeight: '600',
        fontSize: '16px',
        color: '#2D3D14',
        margin: '0 0 6px',
    },
    emptyStateSubtitle: {
        fontSize: '13px',
        color: '#7A8B5A',
        margin: '0 0 18px',
        lineHeight: '1.6',
    },
    emptyStateBtn: {
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.25)',
    },

    onboardingLabel: {
        display: 'block',
        fontSize: '12px',
        color: '#7A8B5A',
        marginBottom: '4px',
        marginTop: '10px',
        textAlign: 'left',
    },
    onboardingInput: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #E5E5D8',
        fontSize: '14px',
        background: '#F4F1E8',
        color: '#2D3D14',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit',
    },
    onboardingSubmitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '16px',
        marginBottom: '8px',
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.25)',
    },
    error: {
        color: '#c62828',
        fontSize: '13px',
        margin: '0 0 8px 0',
        padding: '8px 12px',
        background: 'rgba(198, 40, 40, 0.1)',
        borderRadius: '8px',
    },
};

export default Dashboard;
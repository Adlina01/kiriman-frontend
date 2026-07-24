import React, { useState, useEffect } from 'react';
import { Heart, HandCoins, Users, Gem, BookOpen, Star, HandHeart, CheckCheck, Inbox, CircleCheckBig, Clock } from 'lucide-react';
import { getDoaInbox, markAsRecited } from '../services/api';

// Helper: time ago
function timeAgo(dateString) {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Baru sahaja';
    if (diffMins < 60) return `${diffMins} minit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
}

// 🎨 Category → icon component
const categoryAvatar = {
    Health:    Heart,
    Rezeki:    HandCoins,
    Family:    Users,
    Jodoh:     Gem,
    Education: BookOpen,
    General:   Star,
};

// 🎬 Category → unique animation name
const categoryAnimation = {
    Health:    'heartbeat',   // 💚 pulse like heartbeat
    Rezeki:    'bounce',      // 💰 money bouncing
    Family:    'float',       // 👨‍👩‍👧 gentle floating
    Jodoh:     'glow',        // 💍 sparkling ring
    Education: 'bounce',      // 📚 energetic bounce
    General:   'spin',        // 🌟 star spinning
};//for animation

function DoaInbox() {
    const [duas, setDuas] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [view, setView] = useState('list');

    useEffect(() => {
        fetchDuas(); // initial load
        const interval = setInterval(fetchDuas, 15000); // poll every 15s
        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    const fetchDuas = async () => {
        try {
            const response = await getDoaInbox();
            setDuas(response.data);
        } catch (err) {
            console.log('Error fetching duas');
        }
    };

    const handleRecite = async (id) => {
        try {
            await markAsRecited(id);
            fetchDuas();
            if (currentIndex < duas.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        } catch (err) {
            console.log('Error marking as recited');
        }
    };

    // ============================================
    // 🕋 SLIDE VIEW
    // ============================================
    if (view === 'slide' && duas.length > 0) {
        const currentDoa = duas[currentIndex];
        const AvatarIcon = categoryAvatar[currentDoa.category] || HandHeart;
        const animation = categoryAnimation[currentDoa.category] || 'float';

        return (
            <div style={styles.slideContainer}>
                <div style={styles.mapBg}></div>

                {/* Top controls */}
                <div style={styles.slideTop}>
                    <button style={styles.backCircleBtn} onClick={() => setView('list')}>←</button>
                    <div style={styles.counterPill}>{currentIndex + 1} / {duas.length}</div>

                </div>

                {/* Progress bar */}
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${((currentIndex + 1) / duas.length) * 100}%` }}></div>
                </div>

                {/* 🎬 Animated Avatar — unique per category */}
                <div style={styles.avatarWrap}>
                    <div
                        style={styles.avatar}
                        className={`category-anim-${animation}`}
                    >
                        <AvatarIcon size={36} color="#4A5A2C" />
                    </div>
                </div>

                {/* Sender name */}
                <h2 style={styles.slideSenderName}>{currentDoa.senderName}</h2>

                {/* Time pill only */}
                <div style={styles.timePill}>{timeAgo(currentDoa.createdAt)}</div>

                {/* Doa card */}
                <div style={styles.slideCard}>
                    <p style={styles.slideText}>"{currentDoa.message}"</p>
                    {currentDoa.recited && (
                        <div style={styles.recitedInside}><CheckCheck style={{ verticalAlign: 'middle', marginRight: '4px' }}/>
                            Doa ini selesai dibaca</div>
                    )}
                </div>

                {/* Read button */}
                {!currentDoa.recited && (
                    <button style={styles.reciteSlideBtn} onClick={() => handleRecite(currentDoa.id)}>
                        selesai dibaca
                    </button>
                )}

                {/* Dot indicators */}
                <div style={styles.dotsRow}>
                    {duas.slice(0, Math.min(duas.length, 8)).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.dot,
                                width: i === currentIndex ? '24px' : '8px',
                                background: i === currentIndex ? '#4A5A2C' : '#C9C9A8',
                            }}
                            onClick={() => setCurrentIndex(i)}
                        ></div>
                    ))}
                </div>

                {/* Invisible tap zones */}
                <div style={styles.tapLeft} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}></div>
                <div style={styles.tapRight} onClick={() => setCurrentIndex(Math.min(duas.length - 1, currentIndex + 1))}></div>

                <style>{`
                    /* 🧭 Compass spin */
                    @keyframes compassSpin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    /* 💚 Health — Heartbeat pulse */
                    @keyframes heartbeat {
                        0%   { transform: scale(1); }
                        14%  { transform: scale(1.2); }
                        28%  { transform: scale(1); }
                        42%  { transform: scale(1.15); }
                        70%  { transform: scale(1); }
                        100% { transform: scale(1); }
                    }
                    .category-anim-heartbeat {
                        animation: heartbeat 1.4s ease-in-out infinite;
                    }

                    /* 💰 Rezeki / 📚 Education — Bounce */
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                        50%      { transform: translateY(-16px); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                    }
                    .category-anim-bounce {
                        animation: bounce 1.2s infinite;
                    }

                    /* 👨‍👩‍👧 Family — Gentle float */
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50%      { transform: translateY(-8px); }
                    }
                    .category-anim-float {
                        animation: float 2.5s ease-in-out infinite;
                    }

                    /* 💍 Jodoh — Glow shimmer */
                    @keyframes glow {
                        0%, 100% {
                            filter: drop-shadow(0 0 4px rgba(74, 90, 44, 0.3));
                            transform: scale(1);
                        }
                        50% {
                            filter: drop-shadow(0 0 16px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 32px rgba(255, 215, 0, 0.4));
                            transform: scale(1.1);
                        }
                    }
                    .category-anim-glow {
                        animation: glow 2s ease-in-out infinite;
                    }

                    /* 🌟 General — Slow spin */
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    .category-anim-spin {
                        animation: spin 4s linear infinite;
                    }
                `}</style>
            </div>
        );
    }

    // ============================================
    // 📬 LIST VIEW
    // ============================================
    return (
        <div style={styles.container}>
            <div style={styles.mapBg}></div>

            <div style={styles.header}>
                <div style={styles.headerInner}>
                    <a href="/dashboard" style={styles.back}>←</a>
                    <h2 style={styles.title}>Koleksi Kiriman Doa</h2>
                    <button
                        style={styles.slideViewBtn}
                        onClick={() => { setCurrentIndex(0); setView('slide'); }}
                    >
                        Mod Slaid
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                {duas.length === 0 ? (
                    <div style={styles.empty}>
                        <div style={styles.emptyIcon}><Inbox size={56} /></div>
                        <p style={styles.emptyTitle}>Belum ada doa yang dihantar</p>
                        <p style={styles.emptySubtitle}>Kongsikan link anda kepada keluarga dan rakan!</p>

                    </div>
                ) : (
                    duas.map((doa, index) => (
                        <div
                            key={doa.id}
                            style={{ ...styles.doaCard, opacity: doa.recited ? 0.75 : 1 }}
                            onClick={() => { setCurrentIndex(index); setView('slide'); }}
                        >
                            <div style={{
                                ...styles.doaAccent,
                                background: doa.recited
                                    ? 'linear-gradient(90deg, #C9C9A8, #DDE0C8)'
                                    : 'linear-gradient(90deg, #4A5A2C, #7A8B5A)',
                            }}></div>

                            <div style={styles.doaHeader}>
                                <div style={styles.doaSenderRow}>
                                    <div style={{
                                        ...styles.doaAvatar,
                                        background: doa.recited
                                            ? 'linear-gradient(135deg, #C9C9A8, #DDE0C8)'
                                            : 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
                                    }}>
                                        {(() => {
                                            const ListAvatarIcon = categoryAvatar[doa.category] || HandHeart;
                                            return <ListAvatarIcon size={20} color="white" />;
                                        })()}
                                    </div>
                                    <div>
                                        <p style={styles.doaSenderName}>{doa.senderName}</p>
                                        <p style={styles.doaTimeSmall}>{timeAgo(doa.createdAt)}</p>
                                    </div>
                                </div>
                                {doa.recited
                                    ? <span style={styles.recitedTag}><CircleCheckBig size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Dibaca</span>
                                    : <span style={styles.pendingTag}><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Belum</span>
                                }
                            </div>

                            <p style={styles.doaPreview}>
                                {doa.message.length > 100
                                    ? doa.message.slice(0, 100) + '...'
                                    : doa.message}
                            </p>

                            {!doa.recited && (
                                <button
                                    style={styles.reciteListBtn}
                                    onClick={(e) => { e.stopPropagation(); handleRecite(doa.id); }}
                                >
                                    selesai dibaca
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    // ─── SHARED ───────────────────────────────
    mapBg: {
        position: 'fixed',
        inset: 0,
        backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(74,90,44,0.025) 30px, rgba(74,90,44,0.025) 31px),
            repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(74,90,44,0.025) 30px, rgba(74,90,44,0.025) 31px)
        `,
        pointerEvents: 'none',
        zIndex: 0,
    },

    // ─── SLIDE VIEW ───────────────────────────
    slideContainer: {
        minHeight: '100vh',
        background: `
            radial-gradient(ellipse at top, #DDE0C8 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, #4A5A2C 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, #7A8B5A 0%, transparent 60%),
            linear-gradient(135deg, #F4F1E8 0%, #C9C9A8 50%, #7A8B5A 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 24px 32px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
    },
    slideTop: {
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 5,
    },
    backCircleBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(74,90,44,0.2)',
        color: '#2D3D14',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
    },
    counterPill: {
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(74,90,44,0.15)',
        borderRadius: '999px',
        padding: '8px 18px',
        color: '#2D3D14',
        fontSize: '14px',
        fontWeight: '600',
    },
    compassSmall: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '2px solid rgba(74,90,44,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        animation: 'compassSpin 8s linear infinite',
    },
    progressBar: {
        width: '100%',
        maxWidth: '600px',
        height: '4px',
        background: 'rgba(74,90,44,0.15)',
        borderRadius: '999px',
        marginBottom: '28px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A)',
        borderRadius: '999px',
        transition: 'width 0.4s ease',
    },
    avatarWrap: {
        marginBottom: '16px',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '2px solid rgba(74,90,44,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        boxShadow: '0 4px 16px rgba(74,90,44,0.15)',
    },
    slideSenderName: {
        color: '#2D3D14',
        fontSize: '26px',
        fontWeight: '700',
        margin: '0 0 12px 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5,
    },
    timePill: {
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(74,90,44,0.15)',
        borderRadius: '999px',
        padding: '6px 16px',
        color: '#5A6B3A',
        fontSize: '13px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 5,
    },
    slideCard: {
        width: '100%',
        maxWidth: '560px',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: '20px',
        padding: '28px 24px',
        marginBottom: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '160px',
        maxHeight: '280px',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(74,90,44,0.1)',
        position: 'relative',
        zIndex: 5,
        boxSizing: 'border-box',
    },
    slideText: {
        color: '#2D3D14',
        fontSize: '18px',
        lineHeight: '1.9',
        textAlign: 'center',
        margin: 0,
        fontStyle: 'italic',
    },

    recitedInside: {
        marginTop: '20px',
        textAlign: 'center',
        color: '#7A8B5A',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',

    },
    reciteSlideBtn: {
        width: '100%',
        maxWidth: '560px',
        padding: '16px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        borderRadius: '999px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(74,90,44,0.3)',
        position: 'relative',
        zIndex: 5,
        boxSizing: 'border-box',
    },
    recitedText: {
        color: '#7A8B5A',
        fontSize: '14px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 5,
    },
    dotsRow: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5,
    },
    dot: {
        height: '8px',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    tapLeft: {
        position: 'absolute',
        top: '120px',
        left: 0,
        width: '25%',
        bottom: '100px',
        zIndex: 3,
        cursor: 'pointer',
    },
    tapRight: {
        position: 'absolute',
        top: '120px',
        right: 0,
        width: '25%',
        bottom: '100px',
        zIndex: 3,
        cursor: 'pointer',
    },

    // ─── LIST VIEW ────────────────────────────
    container: {
        minHeight: '100vh',
        background: '#FAFAF5',
        color: '#2D3D14',
        position: 'relative',
        width: '100%',
    },
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#FAFAF5',
        borderBottom: '1px solid #E5E5D8',
        padding: '0 20px',
    },
    headerInner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        maxWidth: '800px',
        margin: '0 auto',
    },
    back: {
        color: '#4A5A2C',
        textDecoration: 'none',
        fontSize: '35px',
        fontWeight: '600',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        color: '#2D3D14',
    },
    slideViewBtn: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        boxShadow: '0 4px 12px rgba(74,90,44,0.25)',
        whiteSpace: 'nowrap',
    },
    content: {
        position: 'relative',
        zIndex: 5,
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    empty: { textAlign: 'center', marginTop: '80px', color: '#7A8B5A' },
    emptyIcon: { fontSize: '64px', marginBottom: '16px' },
    emptyTitle: { fontSize: '20px', fontWeight: '700', color: '#2D3D14', margin: '0 0 8px 0' },
    emptySubtitle: { fontSize: '14px', color: '#7A8B5A', fontStyle: 'italic', margin: '0 0 24px 0' },
    emptyRoute: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 20px',
        background: 'rgba(74,90,44,0.06)',
        borderRadius: '999px',
        fontSize: '20px',
        maxWidth: '200px',
        margin: '0 auto',
    },
    emptyRouteDash: {
        flex: 1,
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '6px 2px',
        backgroundRepeat: 'repeat-x',
    },
    doaCard: {
        background: '#FFFFFF',
        borderRadius: '16px',
        marginBottom: '12px',
        border: '1px solid #E5E5D8',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(74,90,44,0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    doaAccent: { height: '3px', width: '100%' },
    doaHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px 8px',
        flexWrap: 'wrap',
        gap: '8px',
    },
    doaSenderRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    doaAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
    },
    doaSenderName: { fontWeight: '700', margin: 0, fontSize: '15px', color: '#2D3D14' },
    doaTimeSmall: { fontSize: '11px', color: '#9CA890', margin: '2px 0 0 0' },
    recitedTag: {
        background: 'rgba(74,90,44,0.1)',
        color: '#4A5A2C',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    },
    pendingTag: {
        background: 'rgba(184,149,111,0.15)',
        color: '#B8956F',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    },
    doaPreview: {
        color: '#5A6B3A',
        lineHeight: '1.6',
        margin: 0,
        padding: '0 16px 12px',
        fontSize: '14px',
    },
    reciteListBtn: {
        display: 'block',
        width: 'calc(100% - 32px)',
        margin: '4px 16px 14px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        boxShadow: '0 4px 12px rgba(74,90,44,0.2)',
    },
};

export default DoaInbox;
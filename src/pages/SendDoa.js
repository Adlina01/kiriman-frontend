import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import { sendDoa, getDoaSuggestions } from '../services/api';

function SendDoa() {
    const { uniqueLink } = useParams();
    const isDemo = uniqueLink === 'demo';

    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatStep, setChatStep] = useState('greeting');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    useEffect(() => {
        if (chatOpen && chatMessages.length === 0) {
            addBotMessage('Assalamualaikum', 200);
            addBotMessage('Saya boleh bantu anda susunkan doa. Tak tahu nak doa apa? Pilih kategori untuk dapat idea ✨', 1200);
            addBotMessage('Pilih kategori doa:', 2400, getCategoryOptions());
            setChatStep('category');
        }
    }, [chatOpen]);

    const addBotMessage = (text, delay = 600, options = null) => {
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setChatMessages(prev => [...prev, { sender: 'bot', text, options, id: Date.now() + Math.random() }]);
            }, 600);
        }, delay);
    };

    const addUserMessage = text => {
        setChatMessages(prev => [...prev, { sender: 'user', text, id: Date.now() + Math.random() }]);
    };

    const getCategoryOptions = () => [
        { value: 'Health', label: '💚 Kesihatan' },
        { value: 'Rezeki', label: '💰 Rezeki & Kerjaya' },
        { value: 'Family', label: '👨‍👩‍👧 Keluarga' },
        { value: 'Jodoh', label: '💍 Jodoh' },
        { value: 'Education', label: '📚 Pelajaran' },
        { value: 'General', label: '🌟 Lain-lain' },
    ];

    const handleCategoryClick = async (catValue, catLabel) => {
        addUserMessage(catLabel);
        setCategory(catValue);
        setChatStep('loading');
        addBotMessage('Sedang menyusunkan doa untuk anda... ', 400);
        setIsLoading(true);
        try {
            const doas = await getDoaSuggestions(catValue);
            setIsLoading(false);
            addBotMessage('Berikut adalah cadangan doa. Pilih mana yang anda suka:', 400);
            doas.forEach((doaText, idx) => {
                addBotMessage(doaText, 1200 + idx * 600, [{ value: `pick_${idx}`, label: '✅ Pilih doa ini', doaText }]);
            });
            setTimeout(() => {
                addBotMessage('Atau mahu cadangan baru?', 400, [
                    { value: 'regenerate', label: '🔄 Cuba lagi' },
                    { value: 'change_category', label: '📂 Pilih kategori lain' },
                ]);
            }, 1200 + doas.length * 600 + 400);
            setChatStep('suggestions');
        } catch (err) {
            setIsLoading(false);
            addBotMessage('❌ Maaf, gagal mendapat cadangan. Sila cuba lagi.', 400);
            setChatStep('category');
        }
    };

    const handleOptionClick = (value, label, doaText) => {
        if (value.startsWith('pick_')) {
            addUserMessage(label);
            setMessage(doaText);
            addBotMessage('✨ Mantap! Saya telah isikan doa anda di ruangan. Anda boleh ubahsuai jika mahu, kemudian boleh tekan butang "Hantar".', 400);
            setChatStep('done');
            setTimeout(() => setChatOpen(false), 3500);
        } else if (value === 'regenerate') {
            addUserMessage(label);
            handleCategoryClick(category, '🔄 Cadangan baru');
        } else if (value === 'change_category') {
            addUserMessage(label);
            addBotMessage('Pilih kategori doa:', 400, getCategoryOptions());
            setChatStep('category');
        }
    };

    const handleSend = async () => {
        if (!senderName || !message) {
            setError('Sila isi nama dan doa anda');
            return;
        }
        if (isDemo) {
            // Demo mode — don't actually call the backend, just show success
            setSent(true);
            return;
        }
        try {
            const finalCategory = category || 'General';
            await sendDoa(uniqueLink, senderName, null, message, finalCategory);
            setSent(true);
        } catch (err) {
            setError('Gagal menghantar doa. Cuba lagi');
        }
    };

    // 🎬 SUCCESS SCREEN — Sage Journey
    if (sent) {
        return (
            <div style={styles.container}>
                <div style={styles.successCard}>
                    <div style={styles.animationWrapper}>
                        <div style={styles.outerGlow}></div>
                        <div style={styles.successCircle}>
                            <svg style={styles.checkmark} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                                <path style={styles.checkmarkPath} d="M14 27 l 8 8 l 16 -16" />
                            </svg>
                        </div>
                        <span style={{ ...styles.sparkle, ...styles.sparkle1 }}>✦</span>
                        <span style={{ ...styles.sparkle, ...styles.sparkle2 }}>✦</span>
                        <span style={{ ...styles.sparkle, ...styles.sparkle3 }}>✧</span>
                        <span style={{ ...styles.sparkle, ...styles.sparkle4 }}>✧</span>
                        <span style={{ ...styles.sparkle, ...styles.sparkle5 }}>✦</span>
                        <span style={{ ...styles.sparkle, ...styles.sparkle6 }}>✧</span>
                    </div>

                    <h2 style={styles.successTitle}>Doa Berjaya Dihantar</h2>
                    <p style={styles.successMessage}>
                        {isDemo
                            ? 'Ini hanyalah demo — ini hanya contoh jika doa berjaya dihantar!'
                            : 'Semoga Allah mengabulkan doa-doa kita.'}
                    </p>




                </div>

                <style>{`
                    @keyframes glowExpand {
                        0% { transform: scale(0); opacity: 0; }
                        50% { opacity: 0.4; }
                        100% { transform: scale(1.8); opacity: 0; }
                    }
                    @keyframes circleScale {
                        0% { transform: scale(0); opacity: 0; }
                        60% { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes drawCheck {
                        0% { stroke-dashoffset: 50; }
                        100% { stroke-dashoffset: 0; }
                    }
                    @keyframes sparkleFloat {
                        0% { opacity: 0; transform: scale(0) rotate(0deg); }
                        50% { opacity: 1; transform: scale(1) rotate(180deg); }
                        100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
                    }
                    @keyframes textFadeIn {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.mapBg}></div>

            <div style={styles.card}>
                {/* Header */}
                <div style={styles.cardHeader}>
                    <div style={styles.headerIcon}>🕋</div>
                    <h2 style={styles.heading}>Hantar Doa</h2>
                    <p style={styles.subtitle}>Kirimkan doa anda untuk dibacakan di Tanah Suci</p>

                </div>

                {/* Form */}
                <div style={styles.formBody}>
                    {isDemo && (
                        <div style={styles.demoBanner}>
                            <Info size={16} style={{ flexShrink: 0 }} />
                            <span>Ini adalah halaman demo — doa ini tidak akan dihantar kepada sesiapa.</span>
                        </div>
                    )}
                    {error && <p style={styles.error}>{error}</p>}

                    <input style={styles.input} type="text" placeholder="Nama anda *" value={senderName} onChange={e => setSenderName(e.target.value)} />

                    {category && category !== 'General' && (
                        <div style={styles.categoryBadge}>📌 Kategori: <strong>{category}</strong></div>
                    )}

                    <textarea style={styles.textarea} placeholder="Tuliskan doa anda di ruangan ini" value={message} onChange={e => setMessage(e.target.value)} rows={6} />

                    {!message && <p style={styles.hint}>💡 Tak tahu nak doa apa? Klik butang AI assistant di bawah!</p>}

                    <button style={styles.button} onClick={handleSend}>Hantar</button>

                </div>
            </div>

            {/* AI FAB */}
            {!chatOpen && (
                <button style={styles.chatFab} onClick={() => setChatOpen(true)} title="Bantuan Doa AI">
                    <span style={styles.chatFabIcon}>💬</span>
                    <span style={styles.chatFabBadge}>AI</span>
                </button>
            )}

            {/* Chat Widget */}
            {chatOpen && (
                <div style={styles.chatWidget}>
                    <div style={styles.chatHeader}>
                        <div style={styles.chatHeaderLeft}>
                            <div style={styles.botAvatar}>🕋</div>
                            <div>
                                <div style={styles.chatTitle}>Doa Assistant</div>
                                <div style={styles.chatStatus}>
                                    <span style={styles.onlineDot}></span>
                                    Online · AI-Powered
                                </div>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={() => setChatOpen(false)}>×</button>
                    </div>

                    <div style={styles.chatBox}>
                        {chatMessages.map(msg => (
                            <div key={msg.id} style={{ ...styles.messageRow, justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={msg.sender === 'user' ? styles.userBubble : styles.botBubble}>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                                    {msg.options && (
                                        <div style={styles.optionsContainer}>
                                            {msg.options.map(opt => (
                                                <button key={opt.value} style={styles.optionButton}
                                                        onClick={() => chatStep === 'category'
                                                            ? handleCategoryClick(opt.value, opt.label)
                                                            : handleOptionClick(opt.value, opt.label, opt.doaText)
                                                        }
                                                >{opt.label}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {(isTyping || isLoading) && (
                            <div style={styles.messageRow}>
                                <div style={styles.botBubble}>
                                    <div style={styles.typingIndicator}>
                                        <span style={styles.dot}></span>
                                        <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
                                        <span style={{ ...styles.dot, animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={styles.chatFooter}>✨ Powered by AI · Doa pilihan akan auto-fill borang</div>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-8px); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        position: 'relative',
        background: `
            radial-gradient(ellipse at top, #DDE0C8 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, #4A5A2C 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, #7A8B5A 0%, transparent 60%),
            linear-gradient(135deg, #F4F1E8 0%, #C9C9A8 50%, #7A8B5A 100%)
        `,
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
    card: {
        position: 'relative',
        zIndex: 2,
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(74, 90, 44, 0.2)',
        border: '1px solid #E5E5D8',
        overflow: 'hidden',
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #F4F1E8, #FAFAF5)',
        padding: '32px 28px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #E5E5D8',
    },
    headerIcon: {
        width: '64px',
        height: '64px',
        margin: '0 auto 14px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        boxShadow: '0 8px 20px rgba(74, 90, 44, 0.3)',
    },
    heading: { fontSize: '24px', fontWeight: '700', color: '#2D3D14', margin: '0 0 8px 0' },
    subtitle: { color: '#7A8B5A', fontSize: '13px', fontStyle: 'italic', margin: '0 0 16px 0', lineHeight: '1.5' },
    routeMini: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px 16px',
        background: 'rgba(74, 90, 44, 0.06)',
        borderRadius: '999px',
        fontSize: '18px',
        margin: '0 auto',
        maxWidth: '200px',
    },
    routeDash: {
        flex: 1,
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '6px 2px',
        backgroundRepeat: 'repeat-x',
    },
    formBody: { padding: '24px 28px 28px' },
    error: {
        color: '#c62828',
        fontSize: '13px',
        margin: '0 0 12px 0',
        padding: '10px 14px',
        background: 'rgba(198, 40, 40, 0.08)',
        borderRadius: '10px',
        border: '1px solid rgba(198, 40, 40, 0.15)',
    },
    demoBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#8A6D1D',
        fontSize: '12px',
        margin: '0 0 14px 0',
        padding: '10px 14px',
        background: 'rgba(184, 149, 111, 0.12)',
        borderRadius: '10px',
        border: '1px solid rgba(184, 149, 111, 0.3)',
        lineHeight: '1.5',
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
    categoryBadge: {
        background: 'rgba(74, 90, 44, 0.08)',
        color: '#4A5A2C',
        padding: '8px 14px',
        borderRadius: '10px',
        fontSize: '13px',
        margin: '8px 0',
        border: '1px solid rgba(74, 90, 44, 0.2)',
        textAlign: 'left',
    },
    textarea: {
        width: '100%',
        padding: '12px 14px',
        margin: '6px 0',
        borderRadius: '10px',
        border: '1px solid #E5E5D8',
        fontSize: '14px',
        background: '#F4F1E8',
        color: '#2D3D14',
        boxSizing: 'border-box',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.6',
        outline: 'none',
        minHeight: '120px',
    },
    hint: { color: '#9CA890', fontSize: '12px', margin: '4px 0 8px 0', fontStyle: 'italic' },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '12px',
        boxShadow: '0 4px 12px rgba(74, 90, 44, 0.25)',
    },
    footer: { color: '#9CA890', fontSize: '12px', marginTop: '16px', fontStyle: 'italic', textAlign: 'center' },

    // SUCCESS
    successCard: {
        position: 'relative',
        zIndex: 2,
        background: '#FAFAF5',
        padding: '60px 40px 48px',
        borderRadius: '24px',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(74, 90, 44, 0.2)',
        border: '1px solid #E5E5D8',
    },
    animationWrapper: {
        position: 'relative',
        width: '120px',
        height: '120px',
        margin: '0 auto 32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerGlow: {
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 90, 44, 0.3) 0%, rgba(74, 90, 44, 0) 70%)',
        animation: 'glowExpand 2s ease-out',
    },
    successCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4A5A2C, #7A8B5A)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(74, 90, 44, 0.4)',
        animation: 'circleScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
        position: 'relative',
        zIndex: 2,
    },
    checkmark: { width: '50px', height: '50px' },
    checkmarkPath: {
        fill: 'none',
        stroke: '#FAFAF5',
        strokeWidth: '5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '50',
        strokeDashoffset: '50',
        animation: 'drawCheck 0.6s ease-out 0.9s forwards',
    },
    sparkle: { position: 'absolute', color: '#4A5A2C', fontSize: '20px', opacity: 0, pointerEvents: 'none' },
    sparkle1: { top: '-10px', left: '20%', animation: 'sparkleFloat 1.2s ease-out 1.0s' },
    sparkle2: { top: '10%', right: '-10px', animation: 'sparkleFloat 1.2s ease-out 1.2s' },
    sparkle3: { bottom: '20%', right: '-5px', animation: 'sparkleFloat 1.2s ease-out 1.4s' },
    sparkle4: { bottom: '-5px', left: '30%', animation: 'sparkleFloat 1.2s ease-out 1.1s' },
    sparkle5: { bottom: '15%', left: '-10px', animation: 'sparkleFloat 1.2s ease-out 1.3s' },
    sparkle6: { top: '20%', left: '-5px', animation: 'sparkleFloat 1.2s ease-out 1.5s' },
    successTitle: { color: '#2D3D14', fontSize: '26px', fontWeight: '700', marginBottom: '12px', animation: 'textFadeIn 0.8s ease 1.5s both' },
    successMessage: { color: '#7A8B5A', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', animation: 'textFadeIn 0.8s ease 1.8s both' },
    successRoute: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 20px',
        background: 'rgba(74, 90, 44, 0.06)',
        borderRadius: '999px',
        fontSize: '20px',
        margin: '16px auto',
        maxWidth: '200px',
        animation: 'textFadeIn 0.8s ease 2.0s both',
    },
    successRouteLine: {
        flex: 1,
        height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '6px 2px',
        backgroundRepeat: 'repeat-x',
    },
    ameen: { color: '#4A5A2C', fontWeight: '700', fontSize: '18px', marginTop: '8px', animation: 'textFadeIn 0.8s ease 2.1s both' },

    // CHAT FAB
    chatFab: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 24px rgba(74, 90, 44, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '28px',
        zIndex: 100,
    },
    chatFabIcon: { fontSize: '28px' },
    chatFabBadge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: '#C9C9A8',
        color: '#2D3D14',
        fontSize: '10px',
        fontWeight: 'bold',
        padding: '3px 6px',
        borderRadius: '10px',
        border: '2px solid white',
    },

    // CHAT WIDGET
    chatWidget: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '360px',
        maxWidth: 'calc(100vw - 32px)',
        height: '520px',
        background: 'rgba(250, 250, 245, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(45, 61, 20, 0.25)',
        border: '1px solid #E5E5D8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 100,
        animation: 'slideUp 0.3s ease',
    },
    chatHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
    },
    chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    botAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '22px',
    },
    chatTitle: { fontSize: '15px', fontWeight: '700', color: 'white' },
    chatStatus: { fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' },
    onlineDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#C9C9A8', display: 'inline-block' },
    closeBtn: {
        background: 'rgba(255,255,255,0.15)',
        border: 'none',
        color: 'white',
        fontSize: '22px',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
    },
    chatBox: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: '#F4F1E8',
    },
    messageRow: { display: 'flex', width: '100%' },
    botBubble: {
        background: '#FAFAF5',
        color: '#2D3D14',
        padding: '10px 14px',
        borderRadius: '14px 14px 14px 4px',
        maxWidth: '85%',
        fontSize: '13px',
        lineHeight: '1.6',
        boxShadow: '0 1px 4px rgba(74, 90, 44, 0.08)',
        border: '1px solid #E5E5D8',
    },
    userBubble: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white',
        padding: '10px 14px',
        borderRadius: '14px 14px 4px 14px',
        maxWidth: '85%',
        fontSize: '13px',
        lineHeight: '1.6',
    },
    optionsContainer: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' },
    optionButton: {
        background: '#FAFAF5',
        color: '#4A5A2C',
        border: '1.5px solid #C9C9A8',
        padding: '8px 12px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        textAlign: 'left',
        transition: 'all 0.2s',
    },
    typingIndicator: { display: 'flex', gap: '4px', padding: '4px 0' },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#C9C9A8',
        display: 'inline-block',
        animation: 'bounce 1.4s infinite ease-in-out',
    },
    chatFooter: {
        padding: '10px 16px',
        fontSize: '11px',
        color: '#9CA890',
        textAlign: 'center',
        borderTop: '1px solid #E5E5D8',
        background: '#FAFAF5',
        fontStyle: 'italic',
    },
};

export default SendDoa;
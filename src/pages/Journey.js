import React, { useState, useEffect } from 'react';
import { CalendarClock, Sparkles, MoveLeft, House, Plane } from 'lucide-react';
import { getJourney, saveJourney } from '../services/api';

function Journey() {
    const [journey, setJourney] = useState(null);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJourney();
    }, []);

    const fetchJourney = async () => {
        try {
            const response = await getJourney();
            setJourney(response.data);
            setDepartureDate(response.data.departureDate);
            setReturnDate(response.data.returnDate);
            setDepartureCity(response.data.departureCity);
        } catch (err) {
            console.log('No journey yet');
        }
    };

    const handleSave = async () => {
        // ✅ Validate all fields filled
        if (!departureDate || !returnDate || !departureCity) {
            setError('Sila isi semua maklumat!');
            return;
        }

        // ✅ Validate return date is after departure date
        if (new Date(returnDate) <= new Date(departureDate)) {
            setError('Tarikh pulang mesti selepas tarikh berlepas!');
            return;
        }

        setError('');
        try {
            await saveJourney(departureDate, returnDate, departureCity);
            setSaved(true);
            fetchJourney();
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Gagal menyimpan! Cuba lagi.');
        }
    };

    const getPhaseStyle = (phase, current) => {
        const isActive = phase === current;
        return {
            ...styles.phaseItem,
            background: isActive
                ? 'linear-gradient(135deg, #4A5A2C, #2D3D14)'
                : '#FAFAF5',
            border: isActive
                ? '2px solid #4A5A2C'
                : '1px solid #E5E5D8',
            color: isActive ? 'white' : '#2D3D14',
        };
    };

    return (
        <div style={styles.container}>
            <div style={styles.mapBg}></div>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerInner}>
                    <a href="/dashboard" style={styles.back}><MoveLeft size={26} /></a>
                    <h2 style={styles.title}>Kemaskini Perjalanan Umrah</h2>
                </div>
            </div>

            <div style={styles.content}>

                {/* Tarikh Umrah */}
                {journey && journey.departureDate && (
                    <div style={styles.statusCard}>
                        <div style={styles.statusCardAccent}></div>

                        <h3 style={styles.formTitle}>
                            Tarikh Umrah
                        </h3>

                        <div style={styles.dateRow}>
                            <div style={styles.dateItem}>
                                <div style={styles.dateLabel}>Berlepas</div>
                                <div style={styles.dateValue}><Plane size={14} />{journey.departureDate}</div>
                            </div>
                            <div style={styles.dateDivider}></div>
                            <div style={styles.dateItem}>
                                <div style={styles.dateLabel}>Pulang</div>
                                <div style={styles.dateValue}><House size={14} />{journey.returnDate}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fasa Perjalanan */}
                <div style={styles.phasesCard}>
                    <h3 style={styles.formTitle}>
                        Fasa Perjalanan
                    </h3>
                    <div style={styles.phases}>
                        <div style={getPhaseStyle('PREPARING', journey?.phase)}>
                            <div style={styles.phaseIcon}>
                                <CalendarClock size={26} color={journey?.phase === 'PREPARING' ? 'white' : '#4A5A2C'} />
                            </div>
                            <p style={styles.phaseName}>Bersedia</p>
                            <p style={{
                                ...styles.phaseDesc,
                                color: journey?.phase === 'PREPARING' ? 'rgba(255,255,255,0.8)' : '#9CA890',
                            }}>Sebelum berlepas</p>
                        </div>

                        <div style={styles.phaseArrow}>›</div>

                        <div style={getPhaseStyle('IN_MAKKAH', journey?.phase)}>
                            <p style={styles.phaseIcon}>🕋</p>
                            <p style={styles.phaseName}>Di Makkah</p>
                            <p style={{
                                ...styles.phaseDesc,
                                color: journey?.phase === 'IN_MAKKAH' ? 'rgba(255,255,255,0.8)' : '#9CA890',
                            }}>Semasa Umrah</p>
                        </div>

                        <div style={styles.phaseArrow}>›</div>

                        <div style={getPhaseStyle('COMPLETED', journey?.phase)}>
                            <div style={styles.phaseIcon}>
                                <Sparkles size={26} color={journey?.phase === 'COMPLETED' ? 'white' : '#B8956F'} />
                            </div>
                            <p style={styles.phaseName}>Selesai</p>
                            <p style={{
                                ...styles.phaseDesc,
                                color: journey?.phase === 'COMPLETED' ? 'rgba(255,255,255,0.8)' : '#9CA890',
                            }}>Pulang ke tanah air</p>
                        </div>
                    </div>
                </div>

                {/* Journey Form */}
                <div style={styles.formCard}>
                    <div style={styles.formCardAccent}></div>
                    <h3 style={styles.formTitle}>Kemaskini Perjalanan Umrah</h3>

                    {saved && (
                        <div style={styles.successBanner}>
                            kemaskini perjalanan berjaya
                        </div>
                    )}
                    {error && (
                        <div style={styles.errorBanner}>{error}</div>
                    )}

                    <label style={styles.label}>Bandar Berlepas</label>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="cth: Kuala Lumpur"
                        value={departureCity}
                        onChange={e => setDepartureCity(e.target.value)}
                    />

                    <label style={styles.label}>Tarikh Berlepas</label>
                    <input
                        style={styles.input}
                        type="date"
                        value={departureDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => {
                            setDepartureDate(e.target.value);
                            if (returnDate && returnDate <= e.target.value) {
                                setReturnDate('');
                            }
                        }}
                    />

                    <label style={styles.label}>Tarikh Pulang</label>
                    <input
                        style={styles.input}
                        type="date"
                        value={returnDate}
                        min={departureDate || new Date().toISOString().split('T')[0]}
                        onChange={e => setReturnDate(e.target.value)}
                    />

                    <button style={styles.button} onClick={handleSave}>
                        Kemaskini Perjalanan
                    </button>
                </div>
            </div>
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
        position: 'fixed',
        inset: 0,
        backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(74,90,44,0.025) 30px, rgba(74,90,44,0.025) 31px),
            repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(74,90,44,0.025) 30px, rgba(74,90,44,0.025) 31px)
        `,
        pointerEvents: 'none',
        zIndex: 0,
    },

    // Header
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 0',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
    },
    back: {
        color: '#4A5A2C',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        position: 'absolute',
        left: '0',
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        color: '#2D3D14',
    },

    // Content
    content: {
        position: 'relative',
        zIndex: 5,
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },

    // Status card
    statusCard: {
        background: '#FFFFFF',
        border: '1px solid #E5E5D8',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(74,90,44,0.06)',
    },
    statusCardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A, #C9C9A8)',
    },

    // Date row
    dateRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 16px',
        background: 'rgba(74,90,44,0.06)',
        borderRadius: '12px',
    },
    dateItem: { flex: 1, textAlign: 'center' },
    dateLabel: { fontSize: '11px', color: '#9CA890', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
    dateValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2D3D14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
    },
    dateDivider: { width: '1px', height: '30px', background: '#E5E5D8' },

    // Form card
    formCard: {
        background: '#FFFFFF',
        border: '1px solid #E5E5D8',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(74,90,44,0.06)',
    },
    formCardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A, #C9C9A8)',
    },
    formTitle: {
        margin: '0 0 16px 0',
        fontSize: '17px',
        fontWeight: '700',
        color: '#2D3D14',
    },
    successBanner: {
        background: 'rgba(74,90,44,0.08)',
        color: '#4A5A2C',
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '16px',
        border: '1px solid rgba(74,90,44,0.2)',
    },
    errorBanner: {
        background: 'rgba(198,40,40,0.08)',
        color: '#c62828',
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '13px',
        marginBottom: '16px',
        border: '1px solid rgba(198,40,40,0.15)',
    },
    label: {
        display: 'block',
        color: '#7A8B5A',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '6px',
        marginTop: '14px',
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #E5E5D8',
        background: '#F4F1E8',
        color: '#2D3D14',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit',
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
        marginTop: '16px',
        boxShadow: '0 4px 12px rgba(74,90,44,0.25)',
    },

    // Phases card
    phasesCard: {
        background: '#FFFFFF',
        border: '1px solid #E5E5D8',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(74,90,44,0.06)',
    },
    phases: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
    },
    phaseItem: {
        textAlign: 'center',
        flex: 1,
        padding: '16px 8px',
        borderRadius: '16px',
        transition: 'all 0.3s',
    },
    phaseIcon: {
        fontSize: '28px',
        margin: '0 0 8px 0',
        display: 'flex',
        justifyContent: 'center',
    },
    phaseName: {
        fontWeight: '700',
        margin: '0 0 4px 0',
        fontSize: '13px',
    },
    phaseDesc: {
        fontSize: '11px',
        margin: 0,
    },
    phaseArrow: {
        color: '#C9C9A8',
        fontSize: '20px',
        flexShrink: 0,
        fontWeight: '300',
    },

    footerQuote: {
        textAlign: 'center',
        color: '#9CA890',
        fontSize: '12px',
        fontStyle: 'italic',
        padding: '8px 16px 24px',
        margin: 0,
    },
};

export default Journey;
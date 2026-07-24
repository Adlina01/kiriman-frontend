import React, { useEffect, useState } from 'react';
import { ArrowRight,  MailCheck, FileEdit, Link2, Bot, Inbox, Smartphone, Map, Plane, Lock, X, Menu, PlayCircle, BookOpen } from 'lucide-react';

function LandingPage({ onGetStarted }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const goToLogin = () => window.location.href = '/login';
    const goToSend = () => window.location.href = '/send/demo';

    return (
        <div style={styles.page}>
            <div style={styles.mapBg}></div>

            {/* ── NAVBAR ── */}
            <nav style={{
                ...styles.nav,
                boxShadow: scrolled ? '0 2px 20px rgba(74,90,44,0.08)' : 'none',
                padding: isMobile ? '14px 20px' : '16px 40px',
            }}>
                <div style={styles.navLogo}>
                    <div style={styles.navLogoIcon}>🕋</div>
                    <span style={styles.navLogoText}>Kiriman</span>
                </div>

                {/* Desktop nav */}
                {!isMobile && (
                    <div style={styles.navLinks}>
                        <a href="#how" style={styles.navLink}>Panduan</a>
                        <a href="#features" style={styles.navLink}>Ciri-ciri</a>
                    </div>
                )}

                {/* Mobile hamburger */}
                {isMobile && (
                    <button
                        style={styles.hamburger}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                )}

                {/* Mobile menu dropdown */}
                {isMobile && menuOpen && (
                    <div style={styles.mobileMenu}>
                        <a href="#how" style={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>Cara Guna</a>
                        <a href="#features" style={styles.mobileMenuLink} onClick={() => setMenuOpen(false)}>Ciri-ciri</a>
                        <button style={styles.mobileMenuCta} onClick={goToLogin}>
                            Mula Sekarang →
                        </button>
                    </div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section style={{
                ...styles.hero,
                padding: isMobile ? '100px 20px 40px' : '120px 24px 48px',
            }}>
                <div style={styles.blob1}></div>
                <div style={styles.blob2}></div>



                <h1 style={{
                    ...styles.heroTitle,
                    fontSize: isMobile ? '36px' : 'clamp(38px, 7vw, 76px)',
                }}>
                    Satu Perjalanan Suci<br />
                    <span style={styles.heroTitleGradient}>Seribu Doa Mengiringi</span>
                </h1>

                <p style={{
                    ...styles.heroSubtitle,
                    fontSize: isMobile ? '14px' : '18px',
                    marginBottom: '16px',
                }}>
                    Bukan sekadar doa, Sebuah Kiriman Hati
                </p>

                <div style={{
                    ...styles.heroCtas,
                    flexDirection: isMobile ? 'column' : 'row',
                    width: isMobile ? '100%' : 'auto',
                    marginBottom: '16px',
                }}>
                    <button style={{
                        ...styles.btnSecondary,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'center',
                    }} onClick={goToSend}>
                        <PlayCircle size={16} />
                        Demo Hantar Doa
                    </button>
                    <button style={{
                        ...styles.btnPrimary,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'center',
                    }} onClick={goToLogin}>
                        Mula <ArrowRight size={18}/>
                    </button>
                </div>

            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{
                ...styles.section,
                padding: isMobile ? '40px 20px' : '60px 24px',
            }} id="how">
                <div style={styles.maxW}>
                    <div style={{ ...styles.sectionHeader, textAlign: 'center' }}>
                        <div style={styles.sectionLabel}>Panduan</div>
                        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : 'clamp(28px, 4vw, 42px)' }}>
                            Mudah dalam 3 langkah
                        </h2>
                        <p style={styles.sectionSubtitle}>
                            Daftar <FileEdit size={14} style={{ verticalAlign: 'middle' }} /> → Kongsi <Link2 size={14} style={{ verticalAlign: 'middle' }} /> →
                            Doa masuk  <MailCheck size={14} style={{ verticalAlign: 'middle' }} /> → Baca <BookOpen  size={14} style={{ verticalAlign: 'middle' }} />
                        </p>
                    </div>

                    <div style={{
                        ...styles.stepsGrid,
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    }}>
                        {[
                            { num: '01', icon: <FileEdit size={32} />, title: 'Daftar sebagai Pengguna', desc: 'Daftar akaun dan tetapkan tarikh perjalanan Umrah. Sistem akan jana link unik untuk anda kongsikan.' },
                            { num: '02', icon: <Link2 size={32} />, title: 'Kongsikan Link Kepada Semua', desc: 'Hantar link melalui WhatsApp atau Telegram. Sesiapa yang mempunyai link boleh mengirimkan doa mereka.' },
                            { num: '03', icon: '🕋', title: 'Baca Doa di Hadapan Kaabah', desc: 'Semak inbox doa dan gunakan paparan doa supaya setiap kiriman doa dapat dibaca dengan tenang di Tanah Suci.' },
                        ].map((step, i) => (
                            <div key={i} style={styles.stepCard}>
                                <div style={styles.stepAccent}></div>
                                <div style={styles.stepNum}>{step.num}</div>
                                <div style={styles.stepIcon}>{step.icon}</div>
                                <div style={styles.stepTitle}>{step.title}</div>
                                <div style={styles.stepDesc}>{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{
                ...styles.section,
                ...styles.featuresSection,
                padding: isMobile ? '60px 20px' : '100px 24px',
            }} id="features">
                <div style={styles.maxW}>
                    <div style={{ ...styles.sectionHeader, textAlign: 'center' }}>
                        <div style={styles.sectionLabel}>Ciri-ciri</div>
                        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : 'clamp(28px, 4vw, 42px)' }}>
                            Direka khas untuk pengguna dan pengirim
                        </h2>

                    </div>

                    <div style={{
                        ...styles.featuresGrid,
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                    }}>
                        {[
                            { icon: <Bot size={32} />, title: 'AI Cadangan Doa', desc: 'Tak tahu nak doa apa? AI kami bantu cadangkan doa berdasarkan kategori.' },
                            { icon: <Inbox size={32} />, title: 'Inbox Doa Cantik', desc: 'Semua doa berada dalam paparan kad yang elegan dengan slide view.' },
                            { icon: <Smartphone size={32} />, title: 'Link Unik', desc: 'Hantar link terus ke WhatsApp atau Telegram dengan satu klik.' },
                            { icon: <Map size={32} />, title: 'Status Perjalanan', desc: 'Pantau kiraan hari, fasa perjalanan, dan progres bacaan doa.' },
                            { icon: <Plane size={32} />, title: 'Countdown Umrah', desc: 'Countdown bergaya dengan visualisasi laluan dari rumah ke Makkah.' },
                            { icon: <Lock size={32} />, title: 'Selamat & Peribadi', desc: 'Login dengan Google atau email. Data anda selamat dan tersimpan.' },
                        ].map((f, i) => (
                            <div key={i} style={styles.featureCard}>
                                <div style={styles.featureIcon}>{f.icon}</div>
                                <div style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '15px' }}>{f.title}</div>
                                <div style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '13px' }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{
                ...styles.ctaSection,
                padding: isMobile ? '60px 20px' : '100px 24px',
            }}>
                <div style={{
                    ...styles.ctaCard,
                    padding: isMobile ? '40px 24px' : '64px 40px',
                    borderRadius: isMobile ? '24px' : '32px',
                }}>


                    <p style={{ ...styles.ctaSubtitle, fontSize: isMobile ? '14px' : '16px' }}>
                        "Setiap kiriman adalah amanah yang dibawa"
                    </p>
                    <div style={{
                        ...styles.ctaBtns,
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                    }}>
                        <button style={{
                            ...styles.btnWhite,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: 'center',
                        }} onClick={goToLogin}>
                            Daftar Sekarang
                        </button>

                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={styles.footer}>

                <div style={styles.footerCopy}>
                    © 2026 Kiriman
                </div>
            </footer>

            <style>{`
                @keyframes planeFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                html { scroll-behavior: smooth; }
                * { box-sizing: border-box; }
                a { text-decoration: none; }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#FAFAF5',
        color: '#2D3D14',
        fontFamily: "-apple-system, 'DM Sans', sans-serif",
        position: 'relative',
        overflowX: 'hidden',
    },
    mapBg: {
        position: 'fixed',
        inset: 0,
        backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(74,90,44,0.02) 40px, rgba(74,90,44,0.02) 41px),
            repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(74,90,44,0.02) 40px, rgba(74,90,44,0.02) 41px)
        `,
        pointerEvents: 'none',
        zIndex: 0,
    },

    // NAVBAR
    nav: {
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(250,250,245,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E5E5D8',
        transition: 'box-shadow 0.3s',
    },
    navLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    navLogoIcon: {
        width: '36px', height: '36px',
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px',
    },
    navLogoText: {
        fontSize: '20px', fontWeight: '700', color: '#2D3D14',
        fontFamily: 'Georgia, serif',
    },
    navLinks: {
        display: 'flex', alignItems: 'center', gap: '32px',
    },
    navLink: {
        color: '#7A8B5A', textDecoration: 'none',
        fontSize: '14px', fontWeight: '500',
    },
    navCta: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white', border: 'none',
        padding: '10px 20px', borderRadius: '999px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(74,90,44,0.25)',
    },
    hamburger: {
        background: 'transparent', border: 'none',
        fontSize: '22px', cursor: 'pointer', color: '#2D3D14',
        padding: '4px 8px',
    },
    mobileMenu: {
        position: 'absolute',
        top: '100%', left: 0, right: 0,
        background: 'rgba(250,250,245,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E5E5D8',
        padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        zIndex: 99,
    },
    mobileMenuLink: {
        color: '#2D3D14', textDecoration: 'none',
        fontSize: '15px', fontWeight: '500', padding: '8px 0',
        borderBottom: '1px solid #E5E5D8',
    },
    mobileMenuCta: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white', border: 'none',
        padding: '12px', borderRadius: '12px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
        marginTop: '4px',
    },

    // HERO
    hero: {
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', textAlign: 'center', zIndex: 1,
    },
    blob1: {
        position: 'absolute', top: '10%', left: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,90,44,0.08), transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '10%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(122,139,90,0.08), transparent 70%)',
        pointerEvents: 'none',
    },
    heroBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'rgba(74,90,44,0.08)',
        border: '1px solid rgba(74,90,44,0.15)',
        color: '#4A5A2C',
        padding: '8px 18px', borderRadius: '999px',
        fontSize: '13px', fontWeight: '500', marginBottom: '24px',
    },
    heroTitle: {
        fontWeight: '800', color: '#2D3D14',
        lineHeight: '1.15', marginBottom: '18px',
        fontFamily: 'Georgia, serif',
    },
    heroTitleGradient: {
        background: 'linear-gradient(135deg, #4A5A2C, #7A8B5A)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        color: '#7A8B5A',
        maxWidth: '520px',
        margin: '0 auto 16px',
        lineHeight: '1.7',
        fontStyle: 'italic',
    },
    heroCtas: {
        display: 'flex', gap: '12px',
        justifyContent: 'center', marginBottom: '16px',
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        color: 'white', border: 'none',
        padding: '14px 28px', borderRadius: '999px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(74,90,44,0.3)',
        display: 'flex', alignItems: 'center', gap: '8px',
    },
    btnSecondary: {
        background: 'white', color: '#4A5A2C',
        border: '1.5px solid #E5E5D8',
        padding: '14px 28px', borderRadius: '999px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
    },

    // Route card
    routeCard: {
        background: 'white',
        border: '1px solid #E5E5D8',
        borderRadius: '20px',
        display: 'flex', alignItems: 'center',
        boxShadow: '0 8px 40px rgba(74,90,44,0.1)',
        marginBottom: '36px',
    },
    routePin: { textAlign: 'center' },
    pinEmoji: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 6px',
        boxShadow: '0 4px 16px rgba(74,90,44,0.3)',
    },
    pinLabel: {
        fontSize: '11px', fontWeight: '600', color: '#7A8B5A',
    },
    routeLine: {
        flex: 1, minWidth: '40px', height: '2px',
        backgroundImage: 'linear-gradient(90deg, #4A5A2C 50%, transparent 50%)',
        backgroundSize: '10px 2px', backgroundRepeat: 'repeat-x',
    },

    // Stats
    statsRow: {
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', alignItems: 'center',
    },
    statItem: { textAlign: 'center' },
    statNum: {
        fontWeight: '800', color: '#4A5A2C',
        fontFamily: 'Georgia, serif', lineHeight: '1',
    },
    statLabel: {
        fontSize: '11px', color: '#9CA890',
        marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px',
    },
    statDivider: {
        width: '1px', height: '40px', background: '#E5E5D8',
    },

    // SECTIONS
    section: { position: 'relative', zIndex: 1 },
    featuresSection: {
        background: 'linear-gradient(135deg, #F4F1E8, #FAFAF5)',
        borderTop: '1px solid #E5E5D8',
        borderBottom: '1px solid #E5E5D8',
    },
    maxW: { maxWidth: '1100px', margin: '0 auto' },
    sectionHeader: { marginBottom: '48px' },
    sectionLabel: {
        display: 'inline-block',
        background: 'rgba(74,90,44,0.08)', color: '#4A5A2C',
        padding: '6px 16px', borderRadius: '999px',
        fontSize: '11px', fontWeight: '600',
        letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px',
    },
    sectionTitle: {
        fontWeight: '800', color: '#2D3D14',
        marginBottom: '10px', lineHeight: '1.2',
        fontFamily: 'Georgia, serif',
    },
    sectionSubtitle: {
        color: '#7A8B5A', fontSize: '15px',
        maxWidth: '480px', lineHeight: '1.7',
        fontStyle: 'italic', margin: '0 auto',
    },

    // Steps
    stepsGrid: { display: 'grid', gap: '20px' },
    stepCard: {
        background: 'white', border: '1px solid #E5E5D8',
        borderRadius: '20px', padding: '28px 24px',
        position: 'relative', overflow: 'hidden',
    },
    stepAccent: {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #4A5A2C, #7A8B5A)',
    },
    stepNum: {
        fontSize: '44px', fontWeight: '800',
        color: 'rgba(74,90,44,0.08)',
        fontFamily: 'Georgia, serif', lineHeight: '1', marginBottom: '12px',
    },
    stepIcon: { fontSize: '32px', marginBottom: '12px', display: 'block', color: '#4A5A2C' },
    stepTitle: { fontSize: '17px', fontWeight: '700', color: '#2D3D14', marginBottom: '8px' },
    stepDesc: { color: '#7A8B5A', fontSize: '14px', lineHeight: '1.7' },

    // Features
    featuresGrid: { display: 'grid', gap: '16px' },
    featureCard: {
        background: 'white', border: '1px solid #E5E5D8',
        borderRadius: '16px', padding: '20px 16px', textAlign: 'center',
    },
    featureIcon: { fontSize: '32px', marginBottom: '10px', display: 'flex', justifyContent: 'center', color: '#4A5A2C' },
    featureTitle: { fontWeight: '700', color: '#2D3D14', marginBottom: '6px' },
    featureDesc: { color: '#7A8B5A', lineHeight: '1.6' },

    // CTA
    ctaSection: { textAlign: 'center', position: 'relative', zIndex: 1 },
    ctaCard: {
        background: 'linear-gradient(135deg, #4A5A2C, #2D3D14)',
        maxWidth: '700px', margin: '0 auto',
        position: 'relative', overflow: 'hidden',
    },
    ctaCardCircle1: {
        position: 'absolute', top: '-80px', right: '-80px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
    },
    ctaCardCircle2: {
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
    },
    ctaEmoji: { fontSize: '48px', marginBottom: '18px', display: 'block' },
    ctaTitle: {
        fontWeight: '800', color: 'white',
        marginBottom: '12px', lineHeight: '1.2',
        fontFamily: 'Georgia, serif', position: 'relative', zIndex: 2,
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontStyle: 'italic', marginBottom: '32px',
        lineHeight: '1.6', position: 'relative', zIndex: 2,
    },
    ctaBtns: {
        display: 'flex', gap: '12px',
        justifyContent: 'center',
        position: 'relative', zIndex: 2,
    },
    btnWhite: {
        background: 'white', color: '#4A5A2C',
        border: 'none', padding: '14px 28px',
        borderRadius: '999px', fontSize: '14px',
        fontWeight: '700', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
    },
    btnGhost: {
        background: 'rgba(255,255,255,0.15)', color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '14px 28px', borderRadius: '999px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
    },

    // FOOTER
    footer: {
        background: '#2D3D14',
        color: 'rgba(255,255,255,0.6)',
        padding: '36px 24px', textAlign: 'center',
        position: 'relative', zIndex: 1,
    },
    footerLogo: {
        fontSize: '20px', fontWeight: '700', color: 'white',
        fontFamily: 'Georgia, serif', marginBottom: '8px',
    },
    footerTagline: { fontSize: '13px', fontStyle: 'italic', marginBottom: '14px' },
    footerDivider: {
        width: '60px', height: '1px',
        background: 'rgba(255,255,255,0.15)', margin: '0 auto 14px',
    },
    footerCopy: { fontSize: '12px' },
};

export default LandingPage;
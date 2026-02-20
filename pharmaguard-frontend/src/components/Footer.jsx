import { Link } from 'react-router-dom';
import { Shield, Heart, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';

function Footer() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    /*
     * Dark-mode page bg is #0b1120.
     * Footer uses a LIGHTER navy (#1e293b) so it's visually distinct.
     */
    const footerBg = isDark ? '#1e293b' : '#0f172a';

    return (
        <footer
            className="no-print"
            style={{
                background: footerBg,
            }}
        >
            {/* Accent top border */}
            <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #6366f1, #818cf8, #6366f1, transparent)',
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2.5rem 1.5rem 2rem',
            }}>
                {/* Top — Brand + Nav */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #4f6ef7, #3b52cc)',
                            boxShadow: '0 0 20px rgba(79,110,247,0.35)',
                        }}>
                            <Shield style={{ width: '16px', height: '16px', color: 'white' }} strokeWidth={2.2} />
                        </div>
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            color: '#f1f5f9',
                            letterSpacing: '-0.01em',
                        }}>
                            Pharma<span style={{ color: '#818cf8' }}>Guard</span>
                        </span>
                    </div>

                    {/* Nav links */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                            { to: '/analyze', label: 'Analysis' },
                            { to: '/docs', label: 'Documentation' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    color: '#cbd5e1',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom — tagline */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    gap: '0.75rem',
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                    }}>
                        <Sparkles style={{ width: '12px', height: '12px', color: '#818cf8' }} />
                        AI-powered precision pharmacogenomics
                    </p>
                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                    }}>
                        Built with <Heart style={{ width: '12px', height: '12px', color: '#f87171' }} /> for precision medicine
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

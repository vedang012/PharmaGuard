import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Shield, FlaskConical, FileText, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const links = [
    { to: '/analyze', label: 'Analysis', icon: FlaskConical },
    { to: '/docs', label: 'Documentation', icon: FileText },
];

function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header
            className="sticky top-0 z-50 glass-strong no-print"
            style={{ borderBottom: `1px solid var(--color-border)` }}
        >
            <div className="container-app flex items-center justify-between" style={{ height: '4rem' }}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 no-underline group">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                            boxShadow: '0 2px 10px rgba(59, 82, 204, 0.3)',
                        }}
                    >
                        <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-slate-900)' }}>
                        Pharma<span style={{ color: 'var(--color-primary-600)' }}>Guard</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1.5">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium no-underline transition-all ${isActive
                                    ? 'text-white'
                                    : ''
                                }`
                            }
                            style={({ isActive }) =>
                                isActive
                                    ? {
                                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                                        boxShadow: '0 2px 8px rgba(59, 82, 204, 0.25)',
                                    }
                                    : { color: 'var(--color-text-secondary)' }
                            }
                        >
                            <Icon className="w-4 h-4" strokeWidth={2} />
                            {label}
                        </NavLink>
                    ))}

                    {/* Dark mode toggle */}
                    <div style={{ width: '1px', height: '1.25rem', background: 'var(--color-border)', margin: '0 0.375rem' }} />
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <MobileMenu theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
}

function MobileMenu({ theme, toggleTheme }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center gap-2">
            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg cursor-pointer transition-colors"
                aria-label="Toggle menu"
                style={{ border: 'none', background: 'transparent', color: 'var(--color-text-secondary)' }}
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {open && (
                <div
                    className="absolute top-16 left-0 right-0 glass-strong flex flex-col gap-1 z-40 animate-fade-in"
                    style={{
                        padding: 'var(--space-lg)',
                        borderBottom: `1px solid var(--color-border)`,
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all ${isActive ? 'text-white' : ''}`
                            }
                            style={({ isActive }) =>
                                isActive
                                    ? { background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))' }
                                    : { color: 'var(--color-text-secondary)' }
                            }
                        >
                            <Icon className="w-4 h-4" strokeWidth={2} />
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Navbar;

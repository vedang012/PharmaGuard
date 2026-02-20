const VARIANT_STYLES = {
    safe: {
        background: 'linear-gradient(135deg, var(--color-safe), #059669)',
        color: 'white',
        boxShadow: '0 2px 8px var(--color-safe-glow)',
    },
    adjust: {
        background: 'linear-gradient(135deg, var(--color-adjust), #d97706)',
        color: 'white',
        boxShadow: '0 2px 8px var(--color-adjust-glow)',
    },
    toxic: {
        background: 'linear-gradient(135deg, var(--color-danger), #dc2626)',
        color: 'white',
        boxShadow: '0 2px 8px var(--color-danger-glow)',
    },
    primary: {
        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
        color: 'white',
        boxShadow: '0 2px 8px rgba(79, 110, 247, 0.25)',
    },
    neutral: {
        background: 'var(--color-slate-100)',
        color: 'var(--color-slate-700)',
        boxShadow: 'none',
    },
};

const SIZE_CLASSES = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-semibold',
};

function Badge({ children, variant = 'neutral', size = 'md', pulse = false, className = '' }) {
    const style = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${pulse ? 'animate-pulse-glow' : ''} ${className}`}
            style={{
                ...style,
                transition: 'all var(--transition-base)',
            }}
        >
            {children}
        </span>
    );
}

export default Badge;

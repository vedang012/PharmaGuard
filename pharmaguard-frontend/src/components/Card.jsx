function Card({ children, className = '', glow = '', ...rest }) {
    const glowShadow = glow === 'safe'
        ? 'var(--shadow-glow-safe)'
        : glow === 'adjust'
            ? 'var(--shadow-glow-adjust)'
            : glow === 'danger'
                ? 'var(--shadow-glow-danger)'
                : glow === 'primary'
                    ? 'var(--shadow-glow-primary)'
                    : undefined;

    return (
        <div
            className={`card-elevated ${className}`}
            style={{
                padding: 'var(--card-padding)',
                ...(glowShadow ? { boxShadow: glowShadow } : {}),
                ...rest.style,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Card;

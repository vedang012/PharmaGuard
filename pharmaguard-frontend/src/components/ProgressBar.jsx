import { useEffect, useRef, useState } from 'react';

function ProgressBar({ value = 0, max = 1, label = '', color, showPercent = true, animate = true }) {
    const pct = Math.round((value / max) * 100);
    const [width, setWidth] = useState(animate ? 0 : pct);
    const ref = useRef(null);

    useEffect(() => {
        if (animate) {
            const timer = setTimeout(() => setWidth(pct), 100);
            return () => clearTimeout(timer);
        }
    }, [pct, animate]);

    const barColor = color || (
        pct >= 80 ? 'linear-gradient(90deg, var(--color-safe), #059669)'
            : pct >= 50 ? 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))'
                : pct >= 30 ? 'linear-gradient(90deg, var(--color-adjust), #d97706)'
                    : 'linear-gradient(90deg, var(--color-danger), #dc2626)'
    );

    return (
        <div className="w-full" ref={ref}>
            {(label || showPercent) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && (
                        <span className="text-sm font-medium" style={{ color: 'var(--color-slate-700)' }}>
                            {label}
                        </span>
                    )}
                    {showPercent && (
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-slate-600)' }}>
                            {pct}%
                        </span>
                    )}
                </div>
            )}
            <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '8px', background: 'var(--color-slate-100)' }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${width}%`,
                        background: barColor,
                        transition: animate ? 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                        boxShadow: pct >= 80 ? '0 0 8px var(--color-safe-glow)' : 'none',
                    }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIG = {
    error: {
        icon: AlertCircle,
        bg: 'var(--color-danger-light)',
        border: 'var(--color-danger)',
        text: 'var(--color-danger)',
        iconColor: 'var(--color-danger)',
    },
    success: {
        icon: CheckCircle,
        bg: 'var(--color-safe-light)',
        border: 'var(--color-safe)',
        text: '#065f46',
        iconColor: 'var(--color-safe)',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'var(--color-adjust-light)',
        border: 'var(--color-adjust)',
        text: '#92400e',
        iconColor: 'var(--color-adjust)',
    },
    info: {
        icon: Info,
        bg: 'var(--color-primary-50)',
        border: 'var(--color-primary-400)',
        text: 'var(--color-primary-800)',
        iconColor: 'var(--color-primary-500)',
    },
};

function Alert({ type = 'info', message, onClose }) {
    const cfg = CONFIG[type] || CONFIG.info;
    const Icon = cfg.icon;

    return (
        <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl animate-fade-in"
            style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}20`,
                borderLeft: `4px solid ${cfg.border}`,
            }}
        >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: cfg.iconColor }} />
            <p className="flex-1 text-sm leading-relaxed" style={{ color: cfg.text, margin: 0 }}>
                {message}
            </p>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 p-0.5 rounded-md cursor-pointer transition-colors"
                    style={{ background: 'transparent', border: 'none', color: cfg.iconColor }}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default Alert;

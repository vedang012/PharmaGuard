import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function Accordion({ title, children, defaultOpen = false, className = '' }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div
            className={`rounded-xl overflow-hidden transition-all ${className}`}
            style={{ border: '1px solid var(--color-slate-200)', background: 'white' }}
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors text-left"
                style={{
                    background: open ? 'var(--color-slate-50)' : 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    borderBottom: open ? '1px solid var(--color-slate-100)' : 'none',
                }}
                onMouseEnter={(e) => !open && (e.currentTarget.style.background = 'var(--color-slate-50)')}
                onMouseLeave={(e) => !open && (e.currentTarget.style.background = 'transparent')}
            >
                <div className="shrink-0" style={{ color: 'var(--color-slate-400)' }}>
                    {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                <span className="text-sm font-semibold flex-1" style={{ color: 'var(--color-slate-700)' }}>
                    {title}
                </span>
            </button>

            {open && (
                <div className="p-5 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
}

export default Accordion;

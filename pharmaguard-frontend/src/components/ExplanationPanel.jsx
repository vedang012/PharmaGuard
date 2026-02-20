import { useState } from 'react';
import { Brain, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import Card from './Card';

function ExplanationPanel({ explanations }) {
    if (!explanations || explanations.length === 0) return null;

    return (
        <Card className="animate-slide-up stagger-4 p-0">
            <div className="flex items-center gap-2 p-6 pb-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary-50), rgba(139, 92, 246, 0.1))',
                    }}
                >
                    <Brain className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <div>
                    <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                        AI Explanation
                    </h3>
                    <p className="text-xs m-0 flex items-center gap-1" style={{ color: 'var(--color-slate-400)' }}>
                        <Sparkles className="w-3 h-3" /> Powered by explainable AI
                    </p>
                </div>
            </div>

            <div>
                {explanations.map((exp, i) => (
                    <ExplanationItem key={i} explanation={exp} isLast={i === explanations.length - 1} />
                ))}
            </div>
        </Card>
    );
}

function ExplanationItem({ explanation, isLast }) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-slate-100)' }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors text-left"
                style={{ background: open ? 'var(--color-slate-50)' : 'transparent', border: 'none', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => !open && (e.currentTarget.style.background = 'var(--color-slate-50)')}
                onMouseLeave={(e) => !open && (e.currentTarget.style.background = 'transparent')}
            >
                <div className="shrink-0" style={{ color: 'var(--color-slate-400)' }}>
                    {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium flex-1" style={{ color: 'var(--color-slate-700)' }}>
                    {explanation.title}
                </span>
            </button>

            {open && (
                <div className="px-6 pb-5 animate-fade-in" style={{ paddingLeft: '3.5rem' }}>
                    <p
                        className="text-sm leading-relaxed m-0 rounded-xl p-4"
                        style={{
                            color: 'var(--color-slate-600)',
                            background: 'var(--color-slate-50)',
                            borderLeft: '3px solid rgba(139, 92, 246, 0.3)',
                        }}
                    >
                        {explanation.content}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ExplanationPanel;

import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Activity, Hash, FlaskConical } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

const RISK_CONFIG = {
    SAFE: { variant: 'safe', icon: ShieldCheck, label: 'Safe — Standard Dosing', glow: 'safe' },
    ADJUST_DOSE: { variant: 'adjust', icon: ShieldAlert, label: 'Dose Adjustment Required', glow: 'adjust' },
    TOXIC: { variant: 'toxic', icon: ShieldX, label: 'High Risk — Toxicity', glow: 'danger' },
    INEFFECTIVE: { variant: 'toxic', icon: ShieldX, label: 'High Risk — Ineffective', glow: 'danger' },
};

function ConfidenceRing({ value, size = 100 }) {
    const [progress, setProgress] = useState(0);
    const pct = Math.round(value * 100);
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const timer = setTimeout(() => setProgress(pct), 200);
        return () => clearTimeout(timer);
    }, [pct]);

    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const ringColor = pct >= 80 ? 'var(--color-safe)' : pct >= 60 ? 'var(--color-primary-500)' : 'var(--color-adjust)';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-slate-100)"
                    strokeWidth="6"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 6px ${ringColor}40)`,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-slate-900)' }}>
                    {pct}%
                </span>
                <span className="text-xs" style={{ color: 'var(--color-slate-400)' }}>confidence</span>
            </div>
        </div>
    );
}

function RiskSummaryCard({ result }) {
    if (!result) return null;

    const risk = RISK_CONFIG[result.overallRisk] || RISK_CONFIG.SAFE;
    const Icon = risk.icon;

    return (
        <Card className="animate-slide-up" glow={risk.glow}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3 m-0" style={{ color: 'var(--color-slate-400)' }}>
                        Overall Risk Assessment
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-6 h-6" style={{ color: risk.variant === 'safe' ? 'var(--color-safe)' : risk.variant === 'adjust' ? 'var(--color-adjust)' : 'var(--color-danger)' }} />
                        <Badge variant={risk.variant} size="lg" pulse={risk.variant === 'toxic'}>
                            {result.overallRiskLabel || risk.label}
                        </Badge>
                    </div>
                    <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-slate-600)' }}>
                        {result.riskDescription}
                    </p>
                </div>

                <div className="shrink-0 flex justify-center">
                    <ConfidenceRing value={result.confidenceScore} size={110} />
                </div>
            </div>

            <div
                className="flex flex-wrap gap-3 mt-5 pt-5"
                style={{ borderTop: '1px solid var(--color-slate-100)' }}
            >
                <MetaChip icon={Hash} label="Analysis ID" value={result.analysisId} />
                <MetaChip icon={FlaskConical} label="Drug" value={result.drug} />
                <MetaChip icon={Activity} label="Genes Analyzed" value={result.genes?.length || 0} />
            </div>
        </Card>
    );
}

function MetaChip({ icon: Icon, label, value }) {
    return (
        <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--color-slate-50)', border: '1px solid var(--color-slate-100)' }}
        >
            <Icon className="w-3.5 h-3.5" style={{ color: 'var(--color-slate-400)' }} />
            <span className="text-xs" style={{ color: 'var(--color-slate-500)' }}>{label}:</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--color-slate-700)' }}>{value}</span>
        </div>
    );
}

export default RiskSummaryCard;

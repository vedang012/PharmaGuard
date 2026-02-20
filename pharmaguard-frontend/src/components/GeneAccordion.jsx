import { useState } from 'react';
import { ChevronDown, ChevronRight, Dna, BookOpen, Beaker } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

const PHENOTYPE_VARIANT = {
    'Normal Metabolizer': 'safe',
    'Intermediate Metabolizer': 'adjust',
    'Poor Metabolizer': 'toxic',
    'Rapid Metabolizer': 'adjust',
    'Ultrarapid Metabolizer': 'toxic',
    'Intermediate Expression': 'adjust',
};

function GeneAccordion({ genes }) {
    if (!genes || genes.length === 0) return null;

    return (
        <Card className="animate-slide-up stagger-2 p-0">
            <div className="flex items-center gap-2 p-6 pb-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)' }}
                >
                    <Dna className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                    Gene Analysis
                </h3>
                <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}
                >
                    {genes.length} gene{genes.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div>
                {genes.map((gene, i) => (
                    <GeneItem key={gene.gene} gene={gene} isLast={i === genes.length - 1} />
                ))}
            </div>
        </Card>
    );
}

function GeneItem({ gene, isLast }) {
    const [open, setOpen] = useState(false);
    const phenotypeVariant = PHENOTYPE_VARIANT[gene.phenotype] || 'neutral';

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
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold" style={{ color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)' }}>
                            {gene.gene}
                        </span>
                        <span
                            className="text-xs font-mono px-2 py-0.5 rounded-md"
                            style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}
                        >
                            {gene.diplotype}
                        </span>
                        <Badge variant={phenotypeVariant} size="sm">
                            {gene.phenotype}
                        </Badge>
                    </div>
                </div>
                {gene.activityScore !== null && (
                    <span className="text-xs shrink-0" style={{ color: 'var(--color-slate-400)' }}>
                        Activity: {gene.activityScore}
                    </span>
                )}
            </button>

            {open && (
                <div className="px-6 pb-5 pt-1 animate-fade-in" style={{ paddingLeft: '3.5rem' }}>
                    {/* Recommendation */}
                    <div
                        className="rounded-xl p-4 mb-3"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary-50), rgba(79,110,247,0.04))',
                            borderLeft: '3px solid var(--color-primary-400)',
                        }}
                    >
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Beaker className="w-3.5 h-3.5" style={{ color: 'var(--color-primary-600)' }} />
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary-600)' }}>
                                Clinical Recommendation
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-slate-700)' }}>
                            {gene.drugRecommendation}
                        </p>
                    </div>

                    {/* Source */}
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--color-slate-400)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-slate-500)' }}>
                            Source: <span className="font-medium">{gene.guidelineSource}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GeneAccordion;

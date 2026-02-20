import { Activity, Layers, Target, CheckCircle, BarChart3, Shield } from 'lucide-react';
import Card from './Card';

const METRIC_CONFIG = [
    { key: 'totalVariantsAnalyzed', label: 'Variants Analyzed', icon: Layers, format: (v) => v.toLocaleString() },
    { key: 'clinicallyRelevantVariants', label: 'Clinically Relevant', icon: Target, format: (v) => v },
    { key: 'averageReadDepth', label: 'Avg Read Depth', icon: BarChart3, format: (v) => `${v}×` },
    { key: 'averageQualityScore', label: 'Avg Quality Score', icon: Activity, format: (v) => v.toFixed(1) },
    { key: 'genotypeConcordance', label: 'Genotype Concordance', icon: CheckCircle, format: (v) => `${(v * 100).toFixed(1)}%` },
    { key: 'vcfPassRate', label: 'VCF Pass Rate', icon: Shield, format: (v) => `${(v * 100).toFixed(0)}%` },
];

function QualityMetrics({ metrics }) {
    if (!metrics) return null;

    return (
        <Card className="animate-slide-up stagger-3">
            <div className="flex items-center gap-2 mb-5">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)' }}
                >
                    <Activity className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                    Quality Metrics
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {METRIC_CONFIG.map(({ key, label, icon: Icon, format }) => {
                    const value = metrics[key];
                    if (value === undefined || value === null) return null;

                    return (
                        <div
                            key={key}
                            className="flex flex-col gap-2 p-3.5 rounded-xl transition-all"
                            style={{
                                background: 'var(--color-slate-50)',
                                border: '1px solid var(--color-slate-100)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--color-slate-50)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <Icon className="w-4 h-4" style={{ color: 'var(--color-primary-500)' }} />
                            <div>
                                <p className="text-lg font-bold m-0" style={{ color: 'var(--color-slate-800)', fontFamily: 'var(--font-heading)' }}>
                                    {format(value)}
                                </p>
                                <p className="text-xs m-0" style={{ color: 'var(--color-slate-400)' }}>
                                    {label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export default QualityMetrics;

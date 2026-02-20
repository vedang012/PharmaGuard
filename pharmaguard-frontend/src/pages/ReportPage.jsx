import { useLocation, useParams, Link } from 'react-router-dom';
import {
    FileBarChart, Download, ArrowLeft, Shield, Dna, Activity,
    BookOpen, CheckCircle, AlertTriangle, XCircle, Printer, Clock
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';

const RISK_CFG = {
    SAFE: { variant: 'safe', label: 'Safe — Standard Dosing', icon: CheckCircle },
    ADJUST_DOSE: { variant: 'adjust', label: 'Dose Adjustment Required', icon: AlertTriangle },
    TOXIC: { variant: 'toxic', label: 'High Risk — Toxicity', icon: XCircle },
    INEFFECTIVE: { variant: 'toxic', label: 'High Risk — Ineffective', icon: XCircle },
};

function ReportPage() {
    const { id } = useParams();
    const location = useLocation();
    const result = location.state?.result;

    if (!result) {
        return (
            <div className="container-app text-center" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)' }}>
                <FileBarChart className="w-16 h-16 mx-auto" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }} />
                <h2 className="text-xl font-bold" style={{ marginBottom: 'var(--space-sm)' }}>Report Not Found</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>Run an analysis first.</p>
                <Link to="/analyze" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Go to Analysis</Link>
            </div>
        );
    }

    const risk = RISK_CFG[result.overallRisk] || RISK_CFG.SAFE;
    const RiskIcon = risk.icon;
    const glowType = risk.variant === 'safe' ? 'safe' : risk.variant === 'adjust' ? 'adjust' : 'danger';

    function downloadJson() {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharmaguard-${result.analysisId || 'report'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))' }}>
                <div className="container-app flex flex-wrap items-center justify-between" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)', gap: 'var(--space-lg)' }}>
                    <div>
                        <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <FileBarChart className="w-4 h-4" style={{ color: 'var(--color-primary-300)' }} />
                            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-primary-300)' }}>Clinical Report</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold m-0" style={{ color: 'white', fontFamily: 'var(--font-heading)' }}>Report #{result.analysisId}</h1>
                    </div>
                    <div className="flex items-center no-print" style={{ gap: 'var(--space-md)' }}>
                        <button onClick={() => window.print()} className="btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }}><Printer className="w-4 h-4" /> Print</button>
                        <button onClick={downloadJson} className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}><Download className="w-4 h-4" /> JSON</button>
                    </div>
                </div>
            </div>

            <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)', display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                {/* Executive Summary */}
                <Card glow={glowType}>
                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginTop: 0, marginBottom: 'var(--space-xl)' }}>
                        <Shield className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> Executive Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--card-gap)' }}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>Risk</p>
                            <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                <RiskIcon className="w-5 h-5" style={{ color: risk.variant === 'safe' ? 'var(--color-safe)' : risk.variant === 'adjust' ? 'var(--color-adjust)' : 'var(--color-danger)' }} />
                                <Badge variant={risk.variant} size="md">{result.overallRiskLabel || risk.label}</Badge>
                            </div>
                            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>{result.riskDescription}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>Drug</p>
                            <p className="text-lg font-bold m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{result.drug}</p>
                            <p className="text-xs flex items-center m-0" style={{ color: 'var(--color-text-muted)', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                                <Clock className="w-3 h-3" />{new Date(result.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>Confidence</p>
                            <p className="text-3xl font-bold m-0" style={{ color: 'var(--color-primary-600)', fontFamily: 'var(--font-heading)' }}>{Math.round(result.confidenceScore * 100)}%</p>
                            <div style={{ marginTop: 'var(--space-sm)' }}><ProgressBar value={result.confidenceScore} max={1} showPercent={false} animate /></div>
                        </div>
                    </div>
                </Card>

                {/* Gene Breakdown */}
                <div>
                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                        <Dna className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> Gene-Specific Breakdown
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {(result.genes || []).map((gene) => (
                            <GeneReport key={gene.gene} gene={gene} />
                        ))}
                    </div>
                </div>

                {/* Quality & Metadata */}
                <QualitySection metrics={result.qualityMetrics} metadata={result.metadata} />

                <div className="no-print">
                    <Link to="/analyze" className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back to Analysis</Link>
                </div>
            </div>
        </div>
    );
}

function GeneReport({ gene }) {
    const pv = gene.phenotype.includes('Normal') ? 'safe' : gene.phenotype.includes('Intermediate') ? 'adjust' : 'toxic';
    return (
        <Card>
            <div className="flex flex-wrap items-start justify-between" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div>
                    <h3 className="text-base font-bold m-0" style={{ color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)' }}>{gene.gene}</h3>
                    <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                        <span className="text-xs font-mono rounded-md" style={{ padding: '0.125rem 0.5rem', background: 'var(--color-slate-100)', color: 'var(--color-text-secondary)' }}>{gene.diplotype}</span>
                        <Badge variant={pv} size="sm">{gene.phenotype}</Badge>
                    </div>
                </div>
                <div className="flex items-center text-xs" style={{ color: 'var(--color-text-muted)', gap: 'var(--space-xs)' }}><BookOpen className="w-3.5 h-3.5" />{gene.guidelineSource}</div>
            </div>
            <div className="rounded-xl" style={{ padding: 'var(--space-lg)', background: 'linear-gradient(135deg, var(--color-primary-50), rgba(79,110,247,0.04))', borderLeft: '3px solid var(--color-primary-400)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--color-primary-600)', marginBottom: 'var(--space-xs)' }}>Recommendation</p>
                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>{gene.drugRecommendation}</p>
            </div>
            {gene.variants?.length > 0 && (
                <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {gene.variants.map((v) => (
                        <div key={v.rsid} className="flex flex-wrap items-center rounded-lg text-xs" style={{ padding: 'var(--space-sm) var(--space-md)', gap: 'var(--space-lg)', background: 'var(--color-slate-50)' }}>
                            <span className="font-mono font-medium" style={{ color: 'var(--color-text)' }}>{v.rsid}</span>
                            <span style={{ color: 'var(--color-text-muted)' }}>Chr{v.chromosome}:{v.position}</span>
                            <span className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{v.genotype}</span>
                            <Badge variant={v.clinicalSignificance === 'Pathogenic' ? 'toxic' : v.clinicalSignificance === 'Drug Response' ? 'adjust' : 'neutral'} size="sm">{v.clinicalSignificance}</Badge>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

function QualitySection({ metrics, metadata }) {
    if (!metrics) return null;
    const items = [
        { l: 'Variants Analyzed', v: metrics.totalVariantsAnalyzed },
        { l: 'Clinically Relevant', v: metrics.clinicallyRelevantVariants },
        { l: 'Avg Read Depth', v: `${metrics.averageReadDepth}×` },
        { l: 'Avg Quality', v: metrics.averageQualityScore?.toFixed(1) },
        { l: 'Concordance', v: `${((metrics.genotypeConcordance || 0) * 100).toFixed(1)}%` },
        { l: 'VCF Pass Rate', v: `${((metrics.vcfPassRate || 0) * 100).toFixed(0)}%` },
    ];
    return (
        <>
            <Card>
                <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginTop: 0, marginBottom: 'var(--space-lg)' }}>
                    <Activity className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> Quality Metrics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 'var(--space-lg)' }}>
                    {items.map((m) => (
                        <div key={m.l} className="rounded-lg" style={{ padding: 'var(--space-md)', background: 'var(--color-slate-50)' }}>
                            <p className="text-lg font-bold m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>{m.v}</p>
                            <p className="text-xs m-0" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>{m.l}</p>
                        </div>
                    ))}
                </div>
            </Card>
            {metadata && (
                <Card>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 'var(--space-md)' }}>Metadata</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 text-sm" style={{ gap: 'var(--space-md)' }}>
                        <div><p className="text-xs m-0" style={{ color: 'var(--color-text-muted)' }}>Pipeline</p><p className="font-medium m-0" style={{ color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>{metadata.pipelineVersion}</p></div>
                        <div><p className="text-xs m-0" style={{ color: 'var(--color-text-muted)' }}>Genome</p><p className="font-medium m-0" style={{ color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>{metadata.referenceGenome}</p></div>
                        <div><p className="text-xs m-0" style={{ color: 'var(--color-text-muted)' }}>Sources</p><p className="font-medium m-0" style={{ color: 'var(--color-text)', marginTop: 'var(--space-xs)' }}>{metadata.annotationSources?.join(', ')}</p></div>
                    </div>
                </Card>
            )}
        </>
    );
}

export default ReportPage;

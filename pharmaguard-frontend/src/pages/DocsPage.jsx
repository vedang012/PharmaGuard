import {
    BookOpen, Upload, FlaskConical, FileBarChart, Code, Dna,
    ShieldCheck, AlertTriangle, ChevronRight, ExternalLink, Zap
} from 'lucide-react';
import Card from '../components/Card';

const sections = [
    {
        id: 'overview', title: 'Overview', icon: BookOpen,
        content: 'PharmaGuard is a clinical pharmacogenomic analysis platform that predicts drug-gene interaction risks from VCF (Variant Call Format) files. It provides confidence-scored risk assessments with explainable AI output for clinical decision support.',
    },
    {
        id: 'workflow', title: 'Analysis Workflow', icon: Zap,
        steps: [
            { icon: Upload, label: 'Upload VCF', desc: 'Upload a standard VCF file (v4.x) from any sequencing pipeline.' },
            { icon: FlaskConical, label: 'Select Drug', desc: 'Choose a drug from the supported list for interaction analysis.' },
            { icon: Dna, label: 'Genomic Analysis', desc: 'The AI engine maps variants to pharmacogenomic annotations.' },
            { icon: FileBarChart, label: 'Risk Report', desc: 'Receive a structured report with confidence scoring.' },
        ],
    },
    {
        id: 'risk-levels', title: 'Risk Level Definitions', icon: ShieldCheck,
        risks: [
            { level: 'SAFE', label: 'Safe', desc: 'No clinically relevant interactions. Standard dosing recommended.', color: 'var(--color-safe)', bg: 'var(--color-safe-light)' },
            { level: 'ADJUST_DOSE', label: 'Adjust Dose', desc: 'Altered metabolism detected. Dose modification recommended per guidelines.', color: 'var(--color-adjust)', bg: 'var(--color-adjust-light)' },
            { level: 'TOXIC', label: 'Toxic', desc: 'High risk of adverse drug reaction. Alternative therapy recommended.', color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
            { level: 'INEFFECTIVE', label: 'Ineffective', desc: 'Predicted therapeutic failure. Consider alternative drug.', color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
        ],
    },
    {
        id: 'supported-drugs', title: 'Supported Drugs', icon: FlaskConical,
        content: 'The following drugs are currently supported for pharmacogenomic analysis:',
        drugs: ['Warfarin', 'Clopidogrel', 'Codeine', 'Tamoxifen', 'Simvastatin', 'Abacavir', 'Fluorouracil', 'Mercaptopurine'],
    },
    {
        id: 'data-sources', title: 'Data Sources', icon: ExternalLink,
        sources: [
            { name: 'CPIC Guidelines', desc: 'Clinical Pharmacogenetics Implementation Consortium — evidence-based gene-drug interaction guidelines.' },
            { name: 'PharmGKB', desc: 'Pharmacogenomics knowledge resource with annotated variant-drug relationships.' },
            { name: 'ClinVar', desc: 'Archive of genomic variation and its relationship to human health.' },
        ],
    },
    {
        id: 'privacy', title: 'Privacy & Security', icon: AlertTriangle,
        content: 'PharmaGuard processes all genomic data in-memory. No VCF files or patient data are stored permanently. The platform does not log, export, or share any genomic information. All analysis is performed server-side with results returned directly to the client.',
    },
];

function DocsPage() {
    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))' }}>
                <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <BookOpen className="w-4 h-4" style={{ color: 'var(--color-primary-300)' }} />
                        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-primary-300)' }}>Documentation</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold m-0" style={{ color: 'white', fontFamily: 'var(--font-heading)' }}>PharmaGuard Docs</h1>
                    <p className="text-sm m-0" style={{ color: 'rgba(191,207,255,0.7)', marginTop: 'var(--space-xs)' }}>Everything you need to understand the platform.</p>
                </div>
            </div>

            <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="flex flex-col lg:flex-row" style={{ gap: 'var(--space-3xl)' }}>
                    {/* Sidebar */}
                    <aside className="lg:w-56 shrink-0 no-print">
                        <nav className="lg:sticky lg:top-20" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                            {sections.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="flex items-center rounded-lg text-sm no-underline transition-colors"
                                    style={{ padding: 'var(--space-sm) var(--space-md)', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-slate-100)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                                >
                                    <s.icon className="w-3.5 h-3.5" />
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                        {sections.map((s) => (
                            <section key={s.id} id={s.id}>
                                <Card>
                                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', marginTop: 0 }}>
                                        <s.icon className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} />
                                        {s.title}
                                    </h2>
                                    {s.content && <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>{s.content}</p>}
                                    {s.steps && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                                            {s.steps.map((step, i) => (
                                                <div key={i} className="flex items-start rounded-xl" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)', background: 'var(--color-slate-50)' }}>
                                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-50)' }}>
                                                        <step.icon className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)' }}>{step.label}</p>
                                                        <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {s.risks && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                            {s.risks.map((r) => (
                                                <div key={r.level} className="flex items-start rounded-xl" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)', background: r.bg, borderLeft: `3px solid ${r.color}` }}>
                                                    <div>
                                                        <p className="text-sm font-semibold m-0" style={{ color: r.color }}>{r.label}</p>
                                                        <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>{r.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {s.drugs && (
                                        <div className="flex flex-wrap" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                                            {s.drugs.map((d) => (
                                                <span key={d} className="rounded-full text-sm font-medium" style={{ padding: '0.375rem 0.875rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', border: '1px solid var(--color-primary-200)' }}>
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {s.sources && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                            {s.sources.map((src) => (
                                                <div key={src.name} className="rounded-xl" style={{ padding: 'var(--space-md)', background: 'var(--color-slate-50)' }}>
                                                    <p className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)' }}>{src.name}</p>
                                                    <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>{src.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocsPage;

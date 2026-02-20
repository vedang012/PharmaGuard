import { Link } from 'react-router-dom';
import {
    ArrowRight, Upload, FlaskConical, FileBarChart, Shield, Dna,
    Zap, Brain, Lock, ChevronRight, Sparkles, Activity
} from 'lucide-react';
import Aurora from '../components/Aurora/Aurora';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';

const SUPPORTED_DRUGS = [
    { name: 'Codeine', category: 'Analgesic' },
    { name: 'Warfarin', category: 'Anticoagulant' },
    { name: 'Clopidogrel', category: 'Antiplatelet' },
    { name: 'Simvastatin', category: 'Statin' },
    { name: 'Azathioprine', category: 'Immunosuppressant' },
    { name: 'Fluorouracil', category: 'Antineoplastic' },
];

const FEATURES = [
    { icon: Zap, title: 'Instant Analysis', description: 'Upload a VCF file and receive pharmacogenomic risk assessment in seconds.', color: 'var(--color-adjust)', bg: 'var(--color-adjust-light)' },
    { icon: Brain, title: 'Explainable AI', description: 'Every prediction comes with human-readable explanations and clinical context.', color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { icon: Shield, title: 'Evidence-Based', description: 'Powered by CPIC guidelines, PharmGKB, and ClinVar clinical annotations.', color: 'var(--color-safe)', bg: 'var(--color-safe-light)' },
    { icon: Lock, title: 'Privacy First', description: 'No genomic data is stored. All processing happens in-memory with no permanent logging.', color: 'var(--color-primary-500)', bg: 'rgba(79, 110, 247, 0.08)' },
    { icon: Activity, title: 'Confidence Scoring', description: 'Multi-factor confidence breakdown shows exactly how reliable each prediction is.', color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
    { icon: FileBarChart, title: 'Clinical Reports', description: 'Generate structured reports with gene-specific recommendations for clinical use.', color: 'var(--color-primary-700)', bg: 'var(--color-primary-100)' },
];

const STEPS = [
    { step: '01', title: 'Upload VCF', description: 'Upload a standard VCF file from your genomic sequencing pipeline.', icon: Upload },
    { step: '02', title: 'Select Drug', description: 'Specify the drug to evaluate against the patient\'s genotype.', icon: FlaskConical },
    { step: '03', title: 'Get Report', description: 'Receive a comprehensive pharmacogenomic risk assessment with clinical guidance.', icon: FileBarChart },
];

function LandingPage() {
    return (
        <div>
            {/* ─── Hero Section ─── */}
            <section className="hero-gradient text-white" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Aurora WebGL Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}>
                    <Aurora
                        colorStops={['#3b52cc', '#6d8cff', '#3b52cc']}
                        amplitude={1.2}
                        blend={0.7}
                        speed={2.0}
                    />
                </div>
                <div className="container-app text-center" style={{ position: 'relative', zIndex: 2, paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
                    <div
                        className="inline-flex items-center rounded-full text-sm font-medium animate-fade-in"
                        style={{
                            padding: '0.375rem 1rem',
                            gap: 'var(--space-sm)',
                            marginBottom: 'var(--space-3xl)',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        <Sparkles className="w-4 h-4" style={{ color: '#6d8cff' }} />
                        <span style={{ color: 'rgba(255,255,255,0.9)' }}>AI-Powered Clinical Genomics</span>
                    </div>

                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-slide-up"
                        style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', marginBottom: 'var(--space-xl)' }}
                    >
                        <span style={{ color: 'white' }}>Precision</span><br />
                        <span className="text-gradient-hero">Pharmacogenomics.</span><br />
                        <span style={{ color: 'rgba(255,255,255,0.9)' }}>Instantly.</span>
                    </h1>

                    <p
                        className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1"
                        style={{ color: 'rgba(191, 207, 255, 0.85)', marginBottom: 'var(--space-3xl)' }}
                    >
                        Predict drug-gene interactions from VCF files with confidence-scored
                        risk assessments and explainable AI clinical guidance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center animate-slide-up stagger-2" style={{ gap: 'var(--space-lg)' }}>
                        <Link
                            to="/analyze"
                            className="inline-flex items-center no-underline transition-all"
                            style={{
                                gap: 'var(--space-sm)',
                                padding: '1rem 2rem',
                                borderRadius: 'var(--radius-xl)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'white',
                                color: 'var(--color-primary-800)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 40px rgba(255,255,255,0.1)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2), 0 0 60px rgba(255,255,255,0.15)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15), 0 0 40px rgba(255,255,255,0.1)'; }}
                        >
                            Start Analysis <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/docs"
                            className="inline-flex items-center no-underline transition-all"
                            style={{
                                gap: 'var(--space-sm)',
                                padding: '0.875rem 1.5rem',
                                borderRadius: 'var(--radius-xl)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.85)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                        >
                            Read Docs <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, var(--color-bg), transparent)', zIndex: 1 }} />
            </section>

            {/* ─── Features Grid ─── */}
            <section className="container-app section-spacing">
                <div className="text-center" style={{ marginBottom: 'var(--space-4xl)' }}>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)' }}>
                        Why <span className="text-gradient">PharmaGuard</span>
                    </h2>
                    <p className="text-base max-w-xl mx-auto m-0" style={{ color: 'var(--color-text-secondary)' }}>
                        Clinical-grade pharmacogenomic analysis powered by modern AI and evidence-based guidelines.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--card-gap)' }}>
                    {FEATURES.map((f, i) => (
                        <SpotlightCard
                            key={f.title}
                            spotlightColor="rgba(99, 130, 255, 0.15)"
                            className="card-elevated animate-fade-in"
                            style={{ padding: 'var(--card-padding)', animationDelay: `${i * 0.08}s`, borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}
                        >
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: f.bg, marginBottom: 'var(--space-lg)' }}>
                                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-sm)' }}>{f.title}</h3>
                                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>{f.description}</p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </section>

            {/* ─── Supported Drugs ─── */}
            <section style={{ background: 'var(--color-slate-100)' }}>
                <div className="container-app section-spacing">
                    <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
                        <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>Supported Drugs</h2>
                        <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>Pharmacogenomic analysis for commonly prescribed medications</p>
                    </div>
                    <div className="flex flex-wrap justify-center max-w-3xl mx-auto" style={{ gap: 'var(--space-md)' }}>
                        {SUPPORTED_DRUGS.map((drug) => (
                            <SpotlightCard
                                key={drug.name}
                                spotlightColor="rgba(79, 110, 247, 0.2)"
                                className="inline-flex items-center rounded-full transition-all cursor-default"
                                style={{
                                    padding: '0.625rem 1rem',
                                    gap: 'var(--space-sm)',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-sm)',
                                    borderRadius: '9999px',
                                }}
                            >
                                <FlaskConical className="w-3.5 h-3.5" style={{ color: 'var(--color-primary-500)', position: 'relative', zIndex: 2 }} />
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text)', position: 'relative', zIndex: 2 }}>{drug.name}</span>
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)', position: 'relative', zIndex: 2 }}>· {drug.category}</span>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section className="container-app section-spacing">
                <div className="text-center" style={{ marginBottom: 'var(--space-4xl)' }}>
                    <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>How It Works</h2>
                    <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>Three simple steps to clinical-grade pharmacogenomic insight</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto" style={{ gap: 'var(--space-3xl)' }}>
                    {STEPS.map((s, i) => (
                        <div key={s.step} className="relative text-center">
                            {i < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px" style={{ background: 'var(--color-border)', zIndex: 0 }} />
                            )}
                            <div className="relative z-10">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                                        boxShadow: '0 4px 16px rgba(59, 82, 204, 0.3)',
                                        marginBottom: 'var(--space-xl)',
                                    }}
                                >
                                    <s.icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                                </div>
                                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary-500)', marginBottom: 'var(--space-sm)' }}>Step {s.step}</p>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-sm)' }}>{s.title}</h3>
                                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>{s.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className="container-app" style={{ paddingBottom: 'var(--section-gap)' }}>
                <SpotlightCard
                    spotlightColor="rgba(129, 140, 248, 0.2)"
                    className="rounded-2xl text-center"
                    style={{
                        padding: 'var(--space-4xl)',
                        background: 'linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900))',
                        boxShadow: '0 20px 60px rgba(15, 23, 64, 0.3)',
                        borderRadius: 'var(--radius-2xl)',
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <Dna className="w-12 h-12 mx-auto" style={{ color: 'var(--color-primary-300)', opacity: 0.6, marginBottom: 'var(--space-xl)' }} strokeWidth={1} />
                        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)' }}>Ready to analyze?</h2>
                        <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(191, 207, 255, 0.8)', marginBottom: 'var(--space-3xl)' }}>
                            Upload your VCF file and get instant pharmacogenomic risk assessment with clinical-grade confidence scoring.
                        </p>
                        <Link
                            to="/analyze"
                            className="inline-flex items-center no-underline transition-all"
                            style={{ gap: 'var(--space-sm)', padding: '1rem 2rem', borderRadius: 'var(--radius-xl)', fontSize: '1rem', fontWeight: 600, background: 'white', color: 'var(--color-primary-800)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
                        >
                            Start Analysis <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </SpotlightCard>
            </section>

            {/* ─── Disclaimer ─── */}
            <section className="container-app" style={{ paddingBottom: 'var(--space-4xl)' }}>
                <div
                    className="rounded-xl"
                    style={{ padding: 'var(--space-xl)', background: 'var(--color-adjust-light)', border: '1px solid rgba(245, 158, 11, 0.15)', borderLeft: '4px solid var(--color-adjust)' }}
                >
                    <div className="flex" style={{ gap: 'var(--space-md)' }}>
                        <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-adjust)' }} />
                        <div>
                            <p className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>Clinical Disclaimer</p>
                            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--color-text-secondary)' }}>
                                PharmaGuard is a clinical decision support tool for research and educational purposes.
                                Results must be interpreted by a qualified healthcare professional. This tool does not
                                replace laboratory testing, clinical judgment, or regulatory-approved companion diagnostics.
                                No patient genomic data is stored permanently.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;

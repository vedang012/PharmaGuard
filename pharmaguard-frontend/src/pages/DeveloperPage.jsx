import { useState } from 'react';
import { Code, Copy, Check, Terminal, Globe, FileJson, Braces } from 'lucide-react';
import Card from '../components/Card';
import sampleResponse from '../mocks/sample_response.json';

const API_ENDPOINT = {
    method: 'POST', path: '/analyze', contentType: 'multipart/form-data',
    fields: [
        { name: 'file', type: 'File (.vcf)', required: true, desc: 'VCF file to analyze' },
        { name: 'drug', type: 'string', required: true, desc: 'Drug name to evaluate' },
    ],
};

const RESPONSE_FIELDS = [
    { name: 'analysisId', type: 'string', desc: 'Unique identifier for this analysis' },
    { name: 'overallRisk', type: 'enum', desc: 'SAFE | ADJUST_DOSE | TOXIC | INEFFECTIVE' },
    { name: 'confidenceScore', type: 'float [0-1]', desc: 'Overall confidence of the assessment' },
    { name: 'genes[]', type: 'array', desc: 'Gene-specific analysis with diplotype & recommendation' },
    { name: 'explanations[]', type: 'array', desc: 'AI-generated explainable output for clinical context' },
    { name: 'qualityMetrics', type: 'object', desc: 'VCF quality and sequencing depth statistics' },
];

function DeveloperPage() {
    const [copied, setCopied] = useState(false);
    const jsonStr = JSON.stringify(sampleResponse, null, 2);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(jsonStr);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    }

    const darkPanel = { background: 'var(--color-slate-900)', color: 'var(--color-slate-300)' };

    return (
        <div>
            <div style={{ background: 'var(--color-slate-900)' }}>
                <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <Terminal className="w-4 h-4" style={{ color: 'var(--color-primary-400)' }} />
                        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-primary-400)' }}>Developer Mode</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold m-0" style={{ color: 'white', fontFamily: 'var(--font-heading)' }}>API Reference</h1>
                    <p className="text-sm m-0" style={{ color: 'rgba(148,163,184,0.8)', marginTop: 'var(--space-xs)' }}>Backend integration docs, response schema, and live sample data.</p>
                </div>
            </div>

            <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)', display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                {/* API Endpoint */}
                <Card>
                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginTop: 0, marginBottom: 'var(--space-lg)' }}>
                        <Globe className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> API Endpoint
                    </h2>
                    <div className="rounded-xl flex items-center" style={{ ...darkPanel, padding: 'var(--space-lg)', gap: 'var(--space-md)' }}>
                        <span className="rounded-md text-xs font-bold" style={{ padding: '0.25rem 0.625rem', background: 'var(--color-safe)', color: 'white' }}>{API_ENDPOINT.method}</span>
                        <code className="text-sm font-mono" style={{ color: 'var(--color-primary-300)' }}>{API_ENDPOINT.path}</code>
                        <span className="ml-auto text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{API_ENDPOINT.contentType}</span>
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>Request Fields</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {API_ENDPOINT.fields.map((f) => (
                            <div key={f.name} className="flex items-center rounded-lg text-sm" style={{ padding: 'var(--space-sm) var(--space-md)', gap: 'var(--space-md)', background: 'var(--color-slate-50)' }}>
                                <code className="font-mono font-semibold" style={{ color: 'var(--color-primary-700)' }}>{f.name}</code>
                                <span className="rounded text-xs" style={{ padding: '0.125rem 0.5rem', background: 'var(--color-slate-200)', color: 'var(--color-text-secondary)' }}>{f.type}</span>
                                {f.required && <span className="text-xs font-medium" style={{ color: 'var(--color-danger)' }}>required</span>}
                                <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Response Schema */}
                <Card>
                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginTop: 0, marginBottom: 'var(--space-lg)' }}>
                        <Braces className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> Response Schema
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {RESPONSE_FIELDS.map((f) => (
                            <div key={f.name} className="flex items-start rounded-lg text-sm" style={{ padding: 'var(--space-sm) var(--space-md)', gap: 'var(--space-md)', background: 'var(--color-slate-50)' }}>
                                <code className="font-mono font-semibold shrink-0" style={{ color: 'var(--color-primary-700)' }}>{f.name}</code>
                                <span className="rounded text-xs shrink-0" style={{ padding: '0.125rem 0.5rem', background: 'var(--color-slate-200)', color: 'var(--color-text-secondary)' }}>{f.type}</span>
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* cURL Example */}
                <Card>
                    <h2 className="text-lg font-bold flex items-center" style={{ fontFamily: 'var(--font-heading)', gap: 'var(--space-sm)', marginTop: 0, marginBottom: 'var(--space-lg)' }}>
                        <Terminal className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} /> cURL Example
                    </h2>
                    <pre className="rounded-xl text-sm overflow-x-auto m-0" style={{ ...darkPanel, padding: 'var(--space-xl)', fontFamily: '"Fira Code", monospace' }}>
                        {`curl -X POST http://localhost:5174/analyze \\
  -F "file=@patient.vcf" \\
  -F "drug=Warfarin"`}
                    </pre>
                </Card>

                {/* Sample Response */}
                <div className="card-elevated overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
                    <div className="flex items-center justify-between" style={{ ...darkPanel, padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
                            <FileJson className="w-4 h-4" style={{ color: 'var(--color-primary-400)' }} />
                            <span className="text-sm font-medium" style={{ color: 'rgba(226,232,240,0.9)' }}>Sample Response</span>
                        </div>
                        <button onClick={handleCopy} className="flex items-center rounded-md text-xs font-medium cursor-pointer transition-all" style={{ padding: '0.375rem 0.75rem', gap: 'var(--space-xs)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? 'var(--color-safe)' : 'rgba(148,163,184,0.8)' }}>
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <pre className="overflow-auto m-0 text-xs leading-relaxed" style={{ ...darkPanel, padding: 'var(--space-xl)', maxHeight: '600px', fontFamily: '"Fira Code", monospace' }}>
                        <code>{jsonStr}</code>
                    </pre>
                </div>

                {/* Mock Mode Notice */}
                <Card>
                    <div className="flex items-start" style={{ gap: 'var(--space-md)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-adjust-light)' }}>
                            <Code className="w-4 h-4" style={{ color: 'var(--color-adjust)' }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>Mock Mode</h3>
                            <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>
                                When <code style={{ background: 'var(--color-slate-100)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.8125rem' }}>VITE_API_BASE_URL</code> is not set, the app automatically returns the sample response above with a simulated 1.2s delay. Set the env variable to connect to a real backend.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DeveloperPage;

import { useState } from 'react';
import { analyzeVcf } from '../services/api';
import {
    ArrowLeft, Code, Sparkles, ShieldCheck
} from 'lucide-react';
import UploadCard from '../components/UploadCard';
import DrugInput from '../components/DrugInput';
import RiskSummaryCard from '../components/RiskSummaryCard';
import ConfidenceBreakdown from '../components/ConfidenceBreakdown';
import VariantTable from '../components/VariantTable';
import GeneAccordion from '../components/GeneAccordion';
import ExplanationPanel from '../components/ExplanationPanel';
import QualityMetrics from '../components/QualityMetrics';
import JsonViewer from '../components/JsonViewer';
import DownloadButtons from '../components/DownloadButtons';
import Alert from '../components/Alert';
import Loader from '../components/Loader';

function AnalysisPage() {
    const [file, setFile] = useState(null);
    const [drug, setDrug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [showJson, setShowJson] = useState(false);

    const canAnalyze = file && drug.trim().length > 0 && !loading;

    async function handleAnalyze() {
        if (!canAnalyze) return;
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const response = await analyzeVcf(file, drug.trim());
            setResult(response.data);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Analysis failed. Please check your inputs and try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setFile(null);
        setDrug('');
        setResult(null);
        setError('');
        setShowJson(false);
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                    <div className="flex items-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                        <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary-300)' }} />
                        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-primary-300)' }}>
                            AI Analysis Engine
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold m-0" style={{ color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-xs)' }}>
                        Pharmacogenomic Analysis
                    </h1>
                    <p className="text-sm m-0" style={{ color: 'rgba(191, 207, 255, 0.7)' }}>
                        Upload a VCF file and specify drugs to receive a clinical risk assessment.
                    </p>
                </div>
            </div>

            <div className="container-app" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                {/* Input Section */}
                {!result && (
                    <div className="max-w-2xl animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                        <UploadCard file={file} onFileSelect={setFile} />
                        <DrugInput value={drug} onChange={setDrug} />

                        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                        {loading ? (
                            <Loader message="Analyzing genomic data against drug interactions..." />
                        ) : (
                            <button
                                type="button"
                                onClick={handleAnalyze}
                                disabled={!canAnalyze}
                                className="btn-primary w-full"
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '0.9375rem',
                                    borderRadius: 'var(--radius-xl)',
                                    opacity: canAnalyze ? 1 : 0.4,
                                    cursor: canAnalyze ? 'pointer' : 'not-allowed',
                                }}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                Run Pharmacogenomic Analysis
                            </button>
                        )}

                        <p className="text-xs text-center m-0" style={{ color: 'var(--color-text-muted)' }}>
                            🔒 Your VCF data is processed in-memory and is not stored permanently.
                        </p>
                    </div>
                )}

                {/* Results Section */}
                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                        {/* Top controls */}
                        <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-md)' }}>
                            <button type="button" onClick={handleReset} className="btn-ghost">
                                <ArrowLeft className="w-4 h-4" /> New Analysis
                            </button>
                            <div className="flex-1" />
                            <button type="button" onClick={() => setShowJson(!showJson)} className="btn-secondary">
                                <Code className="w-4 h-4" /> {showJson ? 'Hide JSON' : 'Show JSON'}
                            </button>
                        </div>

                        <RiskSummaryCard result={result} />
                        <ConfidenceBreakdown breakdown={result.confidenceBreakdown} />

                        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--card-gap)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                                <GeneAccordion genes={result.genes} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
                                <VariantTable genes={result.genes} />
                                <QualityMetrics metrics={result.qualityMetrics} />
                            </div>
                        </div>

                        <ExplanationPanel explanations={result.explanations} />
                        <JsonViewer data={result.rawRecords} visible={showJson} />

                        <div
                            className="flex justify-between items-center"
                            style={{ paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-border)' }}
                        >
                            <DownloadButtons data={result.rawRecords} analysisId={result.analysisId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalysisPage;

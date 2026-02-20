import { useState, useRef } from 'react';
import { Upload, CheckCircle, FileText, X, Dna } from 'lucide-react';
import Card from './Card';

function UploadCard({ onFileSelect, file }) {
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const MAX_SIZE = 5 * 1024 * 1024;

    function validateFile(f) {
        if (!f) return;
        setError('');
        if (!f.name.endsWith('.vcf')) { setError('Only .vcf files are accepted.'); return; }
        if (f.size > MAX_SIZE) { setError('File size must not exceed 5 MB.'); return; }
        onFileSelect(f);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        validateFile(e.dataTransfer.files?.[0]);
    }

    return (
        <Card className="w-full">
            <div className="flex items-center" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)' }}
                >
                    <Upload className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 className="text-sm font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                    VCF File Upload
                </h3>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="relative flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-all"
                style={{
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4xl) var(--space-2xl)',
                    gap: 'var(--space-lg)',
                    borderColor: dragOver
                        ? 'var(--color-primary-400)'
                        : file
                            ? 'var(--color-safe)'
                            : 'var(--color-border)',
                    background: dragOver
                        ? 'rgba(79, 110, 247, 0.04)'
                        : file
                            ? 'rgba(16, 185, 129, 0.04)'
                            : 'var(--color-slate-50)',
                    animation: dragOver ? 'border-pulse 1s ease-in-out infinite' : 'none',
                }}
            >
                {file ? (
                    <div className="flex flex-col items-center animate-fade-in" style={{ gap: 'var(--space-lg)' }}>
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ background: 'var(--color-safe-light)', boxShadow: 'var(--shadow-glow-safe)' }}
                        >
                            <CheckCircle className="w-7 h-7" style={{ color: 'var(--color-safe)' }} />
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center" style={{ gap: 'var(--space-sm)' }}>
                                <FileText className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                                <p className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)' }}>
                                    {file.name}
                                </p>
                            </div>
                            <p className="text-xs m-0" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                                {(file.size / 1024).toFixed(1)} KB — Ready for analysis
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onFileSelect(null); setError(''); }}
                            className="btn-ghost text-xs"
                            style={{ color: 'var(--color-danger)', padding: '0.25rem 0.75rem' }}
                        >
                            <X className="w-3 h-3" /> Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center" style={{ gap: 'var(--space-lg)' }}>
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
                            style={{ background: 'var(--color-primary-50)' }}
                        >
                            <Dna className="w-7 h-7" style={{ color: 'var(--color-primary-500)' }} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm m-0" style={{ color: 'var(--color-text-secondary)' }}>
                                <span className="font-semibold" style={{ color: 'var(--color-primary-600)' }}>Click to upload</span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs m-0" style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                                VCF files only · Max 5 MB · VCF 4.x supported
                            </p>
                        </div>
                    </div>
                )}

                <input ref={inputRef} type="file" accept=".vcf" onChange={(e) => validateFile(e.target.files?.[0])} className="hidden" />
            </div>

            {error && (
                <p className="text-sm m-0 flex items-center" style={{ color: 'var(--color-danger)', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                    <X className="w-3.5 h-3.5" /> {error}
                </p>
            )}
        </Card>
    );
}

export default UploadCard;

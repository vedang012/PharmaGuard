import { useState } from 'react';
import { Pill, X, Check } from 'lucide-react';
import Card from './Card';
import SpotlightCard from './SpotlightCard/SpotlightCard';
import { useTheme } from '../ThemeContext';

const DRUG_OPTIONS = [
    { name: 'Codeine', category: 'Analgesic' },
    { name: 'Warfarin', category: 'Anticoagulant' },
    { name: 'Clopidogrel', category: 'Antiplatelet' },
    { name: 'Simvastatin', category: 'Statin' },
    { name: 'Azathioprine', category: 'Immunosuppressant' },
    { name: 'Fluorouracil', category: 'Antineoplastic' },
];

function DrugInput({ value, onChange }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const selected = value
        ? value.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    function toggleDrug(drugName) {
        let updated;
        if (selected.includes(drugName)) {
            updated = selected.filter((d) => d !== drugName);
        } else {
            updated = [...selected, drugName];
        }
        onChange(updated.join(', '));
    }

    function clearAll() {
        onChange('');
    }

    return (
        <Card className="w-full">
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: isDark ? 'rgba(79, 110, 247, 0.15)' : 'var(--color-primary-50)' }}
                    >
                        <Pill className="w-4 h-4" style={{ color: isDark ? '#818cf8' : 'var(--color-primary-600)' }} />
                    </div>
                    <h3 className="text-sm font-semibold m-0" style={{ color: 'var(--color-text)' }}>
                        Select Drugs
                    </h3>
                </div>
                {selected.length > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="inline-flex items-center text-xs font-medium cursor-pointer transition-colors"
                        style={{
                            gap: 'var(--space-xs)',
                            padding: '0.25rem 0.625rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-danger)';
                            e.currentTarget.style.color = 'var(--color-danger)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            {/* Drug chip grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 'var(--space-md)' }}>
                {DRUG_OPTIONS.map((drug) => {
                    const isSelected = selected.includes(drug.name);
                    return (
                        <SpotlightCard
                            key={drug.name}
                            spotlightColor={isSelected ? 'rgba(99, 130, 255, 0.35)' : 'rgba(99, 130, 255, 0.15)'}
                            onClick={() => toggleDrug(drug.name)}
                            className="transition-all cursor-pointer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: isSelected
                                    ? '2px solid #6366f1'
                                    : isDark ? '2px solid rgba(148, 163, 184, 0.15)' : '2px solid var(--color-border)',
                                background: isSelected
                                    ? (isDark
                                        ? 'linear-gradient(135deg, rgba(79, 110, 247, 0.15), rgba(99, 102, 241, 0.08))'
                                        : 'linear-gradient(135deg, #eef2ff, rgba(79,110,247,0.08))')
                                    : (isDark ? '#1a2332' : 'var(--color-surface)'),
                                boxShadow: isSelected
                                    ? '0 0 0 3px rgba(99, 102, 241, 0.15), 0 2px 8px rgba(0,0,0,0.1)'
                                    : isDark ? '0 1px 3px rgba(0,0,0,0.2)' : 'var(--shadow-sm)',
                                fontFamily: 'var(--font-body)',
                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {/* Checkbox */}
                            <div
                                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                                style={{
                                    background: isSelected ? '#6366f1' : 'transparent',
                                    border: isSelected
                                        ? '2px solid #6366f1'
                                        : isDark ? '2px solid rgba(148, 163, 184, 0.3)' : '2px solid var(--color-border)',
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                            >
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>

                            {/* Drug info */}
                            <div className="text-left" style={{ minWidth: 0, position: 'relative', zIndex: 2 }}>
                                <p className="text-sm font-semibold m-0" style={{
                                    color: isSelected
                                        ? (isDark ? '#a5b4fc' : '#4338ca')
                                        : 'var(--color-text)',
                                }}>
                                    {drug.name}
                                </p>
                                <p className="text-xs m-0" style={{
                                    color: isSelected
                                        ? (isDark ? '#94a3b8' : 'var(--color-text-muted)')
                                        : 'var(--color-text-muted)',
                                }}>
                                    {drug.category}
                                </p>
                            </div>
                        </SpotlightCard>
                    );
                })}
            </div>

            {/* Selected summary */}
            {selected.length > 0 && (
                <div
                    className="flex items-center flex-wrap animate-fade-in"
                    style={{
                        marginTop: 'var(--space-lg)',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 110, 247, 0.04)',
                        border: isDark ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(79, 110, 247, 0.1)',
                        gap: 'var(--space-xs)',
                    }}
                >
                    <Pill className="w-3.5 h-3.5 shrink-0" style={{ color: '#818cf8' }} />
                    <span className="text-xs font-medium" style={{ color: isDark ? '#a5b4fc' : 'var(--color-primary-600)' }}>
                        Selected:
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {selected.join(', ')}
                    </span>
                </div>
            )}
        </Card>
    );
}

export default DrugInput;

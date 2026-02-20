import { Table2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

const SIGNIFICANCE_CONFIG = {
    Pathogenic: 'toxic',
    'Drug Response': 'adjust',
    Benign: 'safe',
    'Likely Pathogenic': 'toxic',
    'Likely Benign': 'safe',
    'Uncertain Significance': 'neutral',
};

function VariantTable({ genes }) {
    const allVariants = (genes || []).flatMap((gene) =>
        (gene.variants || []).map((v) => ({ ...v, gene: gene.gene }))
    );

    if (allVariants.length === 0) {
        return (
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <Table2 className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                    <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                        Variant Evidence
                    </h3>
                </div>
                <div className="flex flex-col items-center py-8 gap-2" style={{ color: 'var(--color-slate-400)' }}>
                    <Info className="w-8 h-8" />
                    <p className="text-sm m-0">No clinically relevant variants detected</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="animate-slide-up stagger-3 overflow-hidden p-0">
            <div className="flex items-center gap-2 p-6 pb-0 mb-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)' }}
                >
                    <Table2 className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                    Variant Evidence
                </h3>
                <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}
                >
                    {allVariants.length} variant{allVariants.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-slate-50)', borderTop: '1px solid var(--color-slate-100)' }}>
                            {['Gene', 'rsID', 'Chr:Pos', 'Genotype', 'Significance', 'Qual', 'Depth'].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                    style={{ color: 'var(--color-slate-500)', borderBottom: '1px solid var(--color-slate-100)' }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allVariants.map((v, i) => (
                            <tr
                                key={`${v.gene}-${v.rsid}`}
                                className="transition-colors"
                                style={{
                                    borderBottom: '1px solid var(--color-slate-50)',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-slate-50)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary-700)' }}>
                                    {v.gene}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-slate-600)' }}>
                                    {v.rsid}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-slate-500)' }}>
                                    {v.chromosome}:{v.position}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-0.5 rounded-md text-xs font-mono font-medium"
                                        style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-700)' }}
                                    >
                                        {v.genotype}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={SIGNIFICANCE_CONFIG[v.clinicalSignificance] || 'neutral'} size="sm">
                                        {v.clinicalSignificance}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-slate-600)' }}>
                                    {v.qualityScore}
                                </td>
                                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-slate-600)' }}>
                                    {v.readDepth}×
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default VariantTable;

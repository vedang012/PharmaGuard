import { BarChart3 } from 'lucide-react';
import Card from './Card';
import ProgressBar from './ProgressBar';

function ConfidenceBreakdown({ breakdown }) {
    if (!breakdown || breakdown.length === 0) return null;

    return (
        <Card className="animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-5">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)' }}
                >
                    <BarChart3 className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <h3 className="text-base font-semibold m-0" style={{ color: 'var(--color-slate-800)' }}>
                    Confidence Breakdown
                </h3>
            </div>

            <div className="space-y-4">
                {breakdown.map((item, i) => (
                    <div key={item.factor} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <ProgressBar
                            value={item.score}
                            max={1}
                            label={item.factor}
                            animate
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default ConfidenceBreakdown;

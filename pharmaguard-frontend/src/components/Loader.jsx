import { Dna } from 'lucide-react';

function Loader({ message = 'Processing...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
            {/* Animated DNA spinner */}
            <div className="relative w-16 h-16">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                        opacity: 0.15,
                        animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Dna
                        className="w-8 h-8"
                        style={{
                            color: 'var(--color-primary-600)',
                            animation: 'spin-slow 3s linear infinite',
                        }}
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {/* Message */}
            <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--color-slate-700)' }}>
                    {message}
                </p>
                <div
                    className="mt-2 h-1 w-32 rounded-full overflow-hidden mx-auto"
                    style={{ background: 'var(--color-slate-100)' }}
                >
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: '60%',
                            background: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))',
                            animation: 'shimmer 1.5s ease-in-out infinite',
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Loader;

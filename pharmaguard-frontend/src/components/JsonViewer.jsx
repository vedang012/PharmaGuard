import { useState } from 'react';
import { Code, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import Card from './Card';

function JsonViewer({ data, visible }) {
    const [copied, setCopied] = useState(false);
    const [collapsed, setCollapsed] = useState(!visible);

    if (!data) return null;

    const jsonStr = JSON.stringify(data, null, 2);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(jsonStr);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    }

    if (!visible) return null;

    return (
        <div className="animate-fade-in">
            <Card className="p-0 overflow-hidden">
                <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                        background: 'var(--color-slate-900)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" style={{ color: 'var(--color-primary-400)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-slate-300)' }}>
                            Raw JSON Response
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: copied ? 'var(--color-safe)' : 'var(--color-slate-400)',
                        }}
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre
                    className="overflow-auto p-5 m-0 text-xs leading-relaxed"
                    style={{
                        background: 'var(--color-slate-900)',
                        color: 'var(--color-slate-300)',
                        maxHeight: '500px',
                        fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
                    }}
                >
                    <code>{jsonStr}</code>
                </pre>
            </Card>
        </div>
    );
}

export default JsonViewer;

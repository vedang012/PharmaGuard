import { Download } from 'lucide-react';

function DownloadButtons({ data, analysisId }) {
    function downloadJson() {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharmaguard-${analysisId || 'report'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={downloadJson}
                className="btn-secondary"
            >
                <Download className="w-4 h-4" />
                Download JSON
            </button>
        </div>
    );
}

export default DownloadButtons;


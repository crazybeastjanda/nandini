import React from 'react';
import PageShell from '../components/PageShell';
import { DocumentTextIcon } from '../components/icons';

interface TranscriptPageProps {
  onBack: () => void;
  transcript: string;
  summary: string;
}

const TranscriptPage: React.FC<TranscriptPageProps> = ({ onBack, transcript, summary }) => {
    
    const downloadContent = (content: string, filename: string) => {
        if (!content) return;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isSummaryError = summary.startsWith("Error:");

    return (
        <PageShell
            title="Transcript & Summary"
            description="Review the full meeting transcript and an AI-generated summary of key points and decisions."
            icon={<DocumentTextIcon className="h-10 w-10 text-pink-400" />}
            onBack={onBack}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-content-fade-in">
                {/* AI Summary */}
                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">AI-Generated Summary</h2>
                        <button 
                          onClick={() => downloadContent(summary, 'meeting-summary.txt')}
                          disabled={isSummaryError}
                          className="text-sm bg-pink-600/50 hover:bg-pink-600 text-white font-semibold py-1 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Download
                        </button>
                    </div>
                    {isSummaryError ? (
                         <div className="bg-red-500/10 text-red-300 p-4 rounded-lg">
                            <h4 className="font-bold">Summary Generation Failed</h4>
                            <pre className="text-sm whitespace-pre-wrap mt-2 font-mono">{summary}</pre>
                        </div>
                    ) : (
                        <div className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                            {summary}
                        </div>
                    )}
                </div>
                {/* Transcript */}
                <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Full Transcript</h2>
                         <button 
                          onClick={() => downloadContent(transcript, 'meeting-transcript.txt')}
                          className="text-sm bg-slate-600/50 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">
                            Download
                        </button>
                    </div>
                    <div className="text-slate-400 whitespace-pre-wrap font-mono text-xs leading-loose bg-slate-900/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
                        {transcript}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default TranscriptPage;